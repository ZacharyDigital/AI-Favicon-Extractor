import { redirect } from 'next/navigation';

// 根级别的 not-found，重定向到默认语言
export default function RootNotFound() {
  redirect('/en');
}

