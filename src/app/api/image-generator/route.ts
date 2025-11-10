import { NextRequest } from 'next/server';
import JSZip from 'jszip';
import sharp from 'sharp';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('image') as File | null;
    if (!file) {
      return new Response(JSON.stringify({ error: 'NO_FILE' }), { status: 400 });
    }

    const padding = Number(form.get('padding') ?? 0);
    const radius = Number(form.get('radius') ?? 0);
    const transparentBg = String(form.get('transparentBg') ?? 'false') === 'true';
    const backgroundColor = String(form.get('backgroundColor') ?? '#ffffff');

    const arrayBuffer = await file.arrayBuffer();
    let inputBuffer: Buffer = Buffer.from(arrayBuffer);

    // 处理 SVG：转换为 PNG
    if (file.type === 'image/svg+xml') {
      const converted = await sharp(inputBuffer)
        .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      inputBuffer = converted;
    }

    // 输出尺寸（与页面展示列表基本一致）
    const sizes = [16, 32, 180, 192, 512];
    const zip = new JSZip();

    // 生成不同尺寸的 PNG（支持真实像素级内边距与圆角遮罩）
    for (const size of sizes) {
      const bg = transparentBg ? { r: 0, g: 0, b: 0, alpha: 0 } : backgroundColor;
      const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
      const pxPad = Math.round((size * clamp(padding, 0, 50)) / 100);
      const contentSize = Math.max(1, size - pxPad * 2);

      const resized = await sharp(inputBuffer)
        .resize(contentSize, contentSize, { fit: 'contain' })
        .png()
        .toBuffer();

      const composed = sharp({
        create: { width: size, height: size, channels: 4, background: bg },
      }).composite([{ input: resized, gravity: 'center' }]);

      const rx = Math.round((size * clamp(radius, 0, 50)) / 100);
      let out: Buffer;
      if (rx > 0) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${rx}" ry="${rx}" fill="#fff"/></svg>`;
        out = await composed
          .composite([{ input: Buffer.from(svg), blend: 'dest-in' }])
          .png()
          .toBuffer();
      } else {
        out = await composed.png().toBuffer();
      }

      const nameMap: Record<number, string> = {
        16: 'favicon-16x16.png',
        32: 'favicon-32x32.png',
        180: 'apple-touch-icon.png',
        192: 'android-chrome-192x192.png',
        512: 'android-chrome-512x512.png',
      };

      zip.file(nameMap[size] ?? `${size}.png`, out);
    }

    // 生成 webmanifest（最小可用配置）
    const manifest = {
      name: 'Favicon Package',
      short_name: 'Favicon',
      start_url: '/',
      display: 'standalone',
      icons: [
        {
          src: 'android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable',
        },
        {
          src: 'android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
        { src: 'favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { src: 'favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { src: 'apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      background_color: transparentBg ? undefined : backgroundColor,
      theme_color: transparentBg ? undefined : backgroundColor,
      categories: ['utilities'],
    } as const;

    zip.file('site.webmanifest', JSON.stringify(manifest, null, 2));

    // Generate favicon.ico (PNG-based ICO with multiple sizes)
    {
      const icoSizes = [16, 32, 48, 64, 256];
      const pngParts: Buffer[] = [];
      for (const s of icoSizes) {
        const bg = transparentBg ? { r: 0, g: 0, b: 0, alpha: 0 } : backgroundColor;
        const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
        const pxPad = Math.round((s * clamp(padding, 0, 50)) / 100);
        const contentSize = Math.max(1, s - pxPad * 2);

        const resized = await sharp(inputBuffer)
          .resize(contentSize, contentSize, { fit: 'contain' })
          .png()
          .toBuffer();

        const composed = sharp({
          create: { width: s, height: s, channels: 4, background: bg },
        }).composite([{ input: resized, gravity: 'center' }]);

        const rx = Math.round((s * clamp(radius, 0, 50)) / 100);
        const outPng =
          rx > 0
            ? await composed
                .composite([
                  {
                    input: Buffer.from(
                      `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect x="0" y="0" width="${s}" height="${s}" rx="${rx}" ry="${rx}" fill="#fff"/></svg>`
                    ),
                    blend: 'dest-in',
                  },
                ])
                .png()
                .toBuffer()
            : await composed.png().toBuffer();

        pngParts.push(outPng);
      }

      // Build ICO (ICONDIR + ICONDIRENTRY + PNG parts)
      const count = icoSizes.length;
      const header = Buffer.alloc(6);
      header.writeUInt16LE(0, 0); // reserved
      header.writeUInt16LE(1, 2); // type icon
      header.writeUInt16LE(count, 4); // count

      const entries = Buffer.alloc(16 * count);
      let offset = 6 + 16 * count;
      for (let i = 0; i < count; i++) {
        const size = icoSizes[i];
        const png = pngParts[i];
        const w = size === 256 ? 0 : size;
        const h = size === 256 ? 0 : size;
        entries.writeUInt8(w, i * 16 + 0); // width
        entries.writeUInt8(h, i * 16 + 1); // height
        entries.writeUInt8(0, i * 16 + 2); // color count
        entries.writeUInt8(0, i * 16 + 3); // reserved
        entries.writeUInt16LE(1, i * 16 + 4); // planes
        entries.writeUInt16LE(32, i * 16 + 6); // bit count
        entries.writeUInt32LE(png.length, i * 16 + 8); // bytes in resource
        entries.writeUInt32LE(offset, i * 16 + 12); // offset
        offset += png.length;
      }

      const icoBuffer = Buffer.concat([header, entries, ...pngParts]);
      zip.file('favicon.ico', icoBuffer);
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    const blob = new Blob([new Uint8Array(zipBuffer)], { type: 'application/zip' });
    return new Response(blob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="favicon-package.zip"',
      },
    });
  } catch (e) {
    console.error('image-generator error', e);
    return new Response(JSON.stringify({ error: 'SERVER_ERROR' }), { status: 500 });
  }
}
