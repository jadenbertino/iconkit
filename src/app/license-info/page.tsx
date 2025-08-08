import Image from 'next/image'
import LicenseModalScreenshot from './IconModal.png'

export default function LicenseInfoPage() {
  return (
    <main className='container mx-auto px-4 py-12 text-neutral-low'>
      <h1 className='text-impact font-semibold text-neutral-high mb-6'>
        License Information
      </h1>
      <p className='text-small mb-8'>
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className='prose prose-invert max-w-none'>
        <p>
          IconKit aggregates icons from multiple providers. Each provider has
          its own licensing terms, and the license that applies to an icon
          depends on that icon&apos;s original provider.
        </p>

        <h2 className='font-semibold text-subheader pt-4'>
          How to view a license
        </h2>
        <div className='not-prose my-4 max-w-md'>
          <Image
            src={LicenseModalScreenshot}
            alt='Icon details modal highlighting the provider and license link'
            width={1200}
            height={740}
            className='rounded-md border border-slate-800'
            priority
          />
        </div>
        <p>
          When viewing an icon, open the icon details modal (as shown above).
          You&apos;ll see the provider name and a license link. Click the
          license to view the full license text and any usage requirements
          directly at the provider&apos;s source.
        </p>

        <h2 className='font-semibold text-subheader pt-4'>What this means</h2>
        <ul>
          <li>Licensing is determined by the icon&apos;s provider.</li>
          <li>
            Always review the provider&apos;s license to understand permitted
            uses, attribution requirements, and any restrictions.
          </li>
          <li>
            If you are unsure about a specific use, consult the provider&apos;s
            documentation or contact them directly.
          </li>
        </ul>

        <p className='mt-6'>
          We aim to surface accurate links to provider licenses, but you are
          responsible for ensuring your usage complies with the applicable
          license.
        </p>
      </section>
    </main>
  )
}
