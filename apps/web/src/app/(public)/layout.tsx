import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/shared/CustomCursor'
import { SmoothScroll } from '@/components/shared/SmoothScroll'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      <SmoothScroll>
        <Header />
        <main>{children}</main>
        <Footer />
      </SmoothScroll>
    </>
  )
}
