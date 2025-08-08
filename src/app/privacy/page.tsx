export default function PrivacyPage() {
  return (
    <main className='container mx-auto px-4 py-12 text-neutral-low'>
      <h1 className='text-impact font-semibold text-neutral-high mb-6'>
        Privacy Policy
      </h1>
      <p className='text-small mb-8'>
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className='prose prose-invert max-w-none'>
        <p>
          This privacy policy describes how we collect, use, and protect your
          information when you use IconKit. We are committed to safeguarding
          your privacy and ensuring a transparent experience.
        </p>

        <Header title='Information We Collect' />
        <p>
          We may collect non-personal usage data such as pages viewed and basic
          analytics to improve the product. If you choose to contact us, we may
          collect the information you provide (such as your email address) in
          order to respond.
        </p>

        <Header title='How We Use Information' />
        <p>
          We use collected information to operate, maintain, and improve
          IconKit, including monitoring performance, diagnosing issues, and
          informing product decisions.
        </p>

        <Header title='Third-Party Services' />
        <p>
          We may use third-party services (e.g., analytics, hosting) which have
          access to limited information necessary to perform their functions.
          These providers are obligated to protect your data and use it only for
          the services we request.
        </p>

        <Header title='Data Retention' />
        <p>
          We retain information only as long as necessary for the purposes
          outlined in this policy, or as required by law.
        </p>

        <Header title='Your Choices' />
        <p>
          You may choose not to provide certain information, though this may
          limit some functionality. You can also contact us to request updates
          or deletion of information you&apos;ve provided.
        </p>

        <Header title='Changes to This Policy' />
        <p>
          We may update this policy from time to time. Material changes will be
          reflected on this page with an updated date.
        </p>
      </section>
    </main>
  )
}

const Header = ({ title }: { title: string }) => (
  <h2 className='font-semibold text-subheader pt-4'>{title}</h2>
)
