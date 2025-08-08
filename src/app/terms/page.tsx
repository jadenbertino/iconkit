export default function TermsPage() {
  return (
    <main className='container mx-auto px-4 py-12 text-neutral-low'>
      <h1 className='text-impact font-semibold text-neutral-high mb-6'>
        Terms of Service
      </h1>
      <p className='text-small mb-8'>
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className='prose prose-invert max-w-none'>
        <p>
          These Terms of Service (the &quot;Terms&quot;) govern your access to
          and use of IconKit. By accessing or using IconKit, you agree to be
          bound by these Terms.
        </p>

        <Header title='Use of Service' />
        <p>
          You may use IconKit only in compliance with these Terms and all
          applicable laws. You agree not to misuse the service or interfere with
          its normal operation.
        </p>

        <Header title='Content and Licensing' />
        <p>
          Icons and related materials may be subject to third-party licenses. It
          is your responsibility to review and comply with any applicable
          license terms for assets you use.
        </p>

        <Header title='Disclaimers' />
        <p>
          IconKit is provided on an &quot;as is&quot; and &quot;as
          available&quot; basis without warranties of any kind. We do not
          guarantee that the service will be uninterrupted, secure, or
          error-free.
        </p>

        <Header title='Limitation of Liability' />
        <p>
          To the maximum extent permitted by law, in no event shall we be liable
          for any indirect, incidental, special, consequential, or punitive
          damages arising from or relating to your use of IconKit.
        </p>

        <Header title='Changes to the Terms' />
        <p>
          We may update these Terms from time to time. Continued use of the
          service after changes become effective constitutes acceptance of the
          revised Terms.
        </p>
      </section>
    </main>
  )
}

const Header = ({ title }: { title: string }) => (
  <h2 className='font-semibold text-subheader pt-4'>{title}</h2>
)
