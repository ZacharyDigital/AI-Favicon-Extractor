interface ExamplesGalleryProps {
  title: string;
}

export function ExamplesGallery({ title }: ExamplesGalleryProps) {
  // 示例数据 - 使用占位图片
  const examples = [
    {
      id: '1',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBnaj51IfIw20RDzr2FITXJRZ9egDTHXsB5oLJXS8mK0CLipnbHgJvXHPoAJn1Lq-vo7yqN3NF8vWuydFygDP3MdXSnv2MczVrAmUOVveMuoGu7DpgtXcC1rLDAaJtdm3b6E3ezsM6W8f_VTjFuzOXyx3HCpiBFU5ARPIeJfWwz4fC7FY0wJn91P0wZkTqyx7bU0CJ_2imwTbZSkK-BgJKYoqOrzEbBGfQfZOrWh2RMq19vv2DNODW0VkKzz1wH_Gmkq5PXnLvY_CE',
      alt: 'AI-generated favicon of a stylized fox',
    },
    {
      id: '2',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDqx5tKBIAXHZMh74lXmnCb664pp-Yk6aZLBqdR6kShTDkRFwk5Y75lGrNS0457yKyHDA5dA_XAP-ZFEOW0LKhKvMOGgaNJC7hYsnNfjNqW0FgcZwUwTzi04Ds66WPcfVChHkrAwdQTIUavfD__s2ermU3mXw8ir17KD_tD-cb59qivqQlGL-CU8jRxkzFfwVir3DhrygQhslWqu8diL42_Bgl6hm1oxZx2b9uWuDtmArEj0RpQCsgNZ8PlDvWmJ7DF7FaRke1wguo',
      alt: 'AI-generated favicon of a geometric mountain peak',
    },
    {
      id: '3',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA5iO5KQuYq5eXvTPWVK75j9tPNtWnBSGMLodCJVNQebSyto--OqM1FnlYLUYQweytB_WPFE982UNLYq0x7czQCs3pZ0TT9N0SlSYLLZU9qgoG-Z7xwlsy51HPhSZ8gvGv2LbJCfs5huSfc9jIVKqSa-QpLPahTDez-OiKTjBaVhLHKOyOLiSqTwUIr2PCW8r9qouDKjZXBWmbb8QA9dJRFQ5kGq98XvXpqX02aWtCWBUfEmwUm01ooHQmgDuV7hTIMULlhnOV1UlM',
      alt: 'AI-generated favicon of a minimalist wave icon',
    },
    {
      id: '4',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBcT0u-gkeLKhyNC6YEojp2yX3RfPNwWg2rL7MpYjwfXxzP_AkZLB_Lu4nxjAiVaoMLBjTKwg75lqcXdZBRF5fbsjEhoBSeeHsPUy4iI1ovF3f3xltNwH0mZptdreRqoHIvls2aDoj93iDrs2GfUoXTvxq6qr9d1-8bplZIAquT_BexByXkcWvsSqmvZULWfTN0RvEEm1hId7rsNTqRfrAY7iQFYMzbeFqt_B9lnC_1Bqu-WAIiGQ6Ug_z8YP7voba3Ae0Hzkc05fM',
      alt: 'AI-generated favicon of a circuit board pattern',
    },
    {
      id: '5',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAYZ1Qj1cr5MJ9Tt3ipfRRQbc1z1hnTAoVudTToBPwX6cEXeeQNF4I1h2gCQ_ieFnjmLrqpDm5FzE0034RYmInHX2Zk7QSu5Uho4WxAMa6KI5BcBA8MLdkgDWJiIQ6iid_SrOEH0GBXMxy4Br5NRon6szHMraz5MJ6tA76kgdwq2481NgSeN1kAmWwVogvFzTAtvsw0c1xu2zg7-4ijN5-QURC8moub7zAeMr63AhCh8Y5959fkqHOLRacJZ6u1WGoSLoyLOjEnZUE',
      alt: 'AI-generated favicon of a pixelated heart',
    },
    {
      id: '6',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBmnMntSkcfrsX8mSDse3SrjVTvt21Os-O0-XuE_FPVjyF-QQik9YeIvqx28144kJ-snU9FrHjsrseOMu474WvOICJAV84WVZRKt2SQLvLbkA7XmFZzyq2aapV5VwcciV7HTyqELsEamYZtwfROhU8hkUpZpvw3t8n8HP7hR_R1a1Dl_aNUqsKJIdrZY4x5gzVEqkRHvO9OXitHgl_yawXQUto_laC_X16t-tuvVpyjEnXBJi5HpqFlV9xEyb0Z0R0ln8e0Xdv0dSM',
      alt: 'AI-generated favicon of an abstract paint splash',
    },
    {
      id: '7',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCnfcY83EVuES7Ab5lH3HXpO9NjsuFYQa-oBaurpeqy0oAqZlbU0hjv1GeXFR7xt4QtWW-gaADYBlPd-zoCt4GTnftmATajBjsab5T82i48YXzTTM8fe3Iu-hn92vM582eMOpOom2DwuwtHUuyXLEcDoHssj3WvQyYEq2toSj7z6yNwdTPn-ypJ6eCEpmYzzmw50kNlDZA_53Go5977taEohKOMM_TZ7HFd9t5lChmX7ioX8WBC7WBl37YtrlpN8MCbnwKNSd_uxkA',
      alt: 'AI-generated favicon of a simple coffee cup',
    },
    {
      id: '8',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCUO5XcPrqZzkcgVlSRD1Nql8CH6e7Cb085S-nCYR7jdYYlq20ftnqAvhFtNKEUbGCc_9J_4J90jlNTZIrxP-A222Zoo8MIH4z94EKueBHokFnMoKY2OzMsD_clioxWLYBQYC2f710M5n7wywakW24R8E23hxRS4xyCkuJmqb5FL4MIfu7FS_6MIuWUvllNwyQruD7YsUw9uwU5uANjDSDR5CwtVfJmugWHG_kjtQEpaesGtLzk8nrcwKvqFYycN7T9IOxikLfzaFc',
      alt: "AI-generated favicon of a glowing letter 'A'",
    },
  ];

  return (
    <section id="examples">
      <h2 className="px-4 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-[#191022]">
        {title}
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {examples.map((example) => (
          <div key={example.id} className="flex flex-col gap-3">
            <div
              className="aspect-square w-full rounded-lg bg-cover bg-center bg-no-repeat transition-transform duration-300 hover:scale-105"
              style={{ backgroundImage: `url("${example.imageUrl}")` }}
              role="img"
              aria-label={example.alt}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
