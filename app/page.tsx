import Image from 'next/image'
import Link from 'next/link'
import FileUpload from './ui/FileUpload'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
		<FileUpload/>
    </main>
  )
}
