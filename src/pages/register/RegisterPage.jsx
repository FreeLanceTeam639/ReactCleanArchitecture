import { ROUTES } from '../../shared/constants/routes.js';
import { navigateWithScroll } from '../../shared/lib/navigation/navigateWithScroll.js';
import { useRegisterForm } from '../../features/auth/hooks/useRegisterForm.js';
import LanguageSwitcher from '../../shared/ui/LanguageSwitcher.jsx';
import BrandLogo from '../../shared/ui/BrandLogo.jsx';

function RegisterAlert({ message, type }) {
  if (!message) {
    return null;
  }

  return <div className={type === 'success' ? 'authAlert success' : 'authAlert error'}>{message}</div>;
}

export default function RegisterPage({ navigate }) {
  const {
    form,
    showPassword,
    showConfirmPassword,
    isSubmitting,
    feedback,
    setFieldValue,
    setShowPassword,
    setShowConfirmPassword,
    submitRegister
  } = useRegisterForm(navigate);

  return (
    <div className="authShell">
      <div className="authBackdrop" />
      <div className="wrapLarge authGrid">
        <section className="authPanel fadeUp">
          <div className="authPanelTopBar">
            <LanguageSwitcher className="authLanguageSwitcher" />
          </div>

          <BrandLogo
            href={ROUTES.home}
            className="brand authBrand"
            onClick={(event) => navigateWithScroll(event, ROUTES.home, navigate)}
          />

          <p className="authSubtitle">
            Every account starts as a member and can unlock job posting after verification.
          </p>

          <RegisterAlert message={feedback.message} type={feedback.type} />

          <form className="authForm registerForm" onSubmit={submitRegister}>
            <div className="registerGrid">
              <label className="authField">
                <span>First Name</span>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(event) => setFieldValue('firstName', event.target.value)}
                  placeholder="Please enter first name"
                  autoComplete="given-name"
                  required
                />
              </label>

              <label className="authField">
                <span>Last Name</span>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(event) => setFieldValue('lastName', event.target.value)}
                  placeholder="Please enter last name"
                  autoComplete="family-name"
                  required
                />
              </label>

              <label className="authField">
                <span>User Name</span>
                <input
                  type="text"
                  value={form.userName}
                  onChange={(event) => setFieldValue('userName', event.target.value)}
                  placeholder="Please enter user name"
                  autoComplete="username"
                  required
                />
              </label>

              <label className="authField">
                <span>Your Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setFieldValue('email', event.target.value)}
                  placeholder="Please enter your email"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="authField">
                <span>Password</span>
                <div className="passwordWrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(event) => setFieldValue('password', event.target.value)}
                    placeholder="Please enter password"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="passwordToggle interactive"
                    onClick={() => setShowPassword((currentState) => !currentState)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </label>

              <label className="authField">
                <span>Retype Password</span>
                <div className="passwordWrap">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={(event) => setFieldValue('confirmPassword', event.target.value)}
                    placeholder="Please retype password"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="passwordToggle interactive"
                    onClick={() => setShowConfirmPassword((currentState) => !currentState)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </label>
            </div>

            <button type="submit" className="authSubmit interactive" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Join Now'}
            </button>
          </form>

          <p className="authSwitch">
            Already have an account?{' '}
            <button
              type="button"
              className="inlineLink interactive"
              onClick={() => navigate(ROUTES.login)}
            >
              Sign In
            </button>
          </p>
        </section>

        <section className="authPreview fadeUp delayOne" aria-hidden="true">
          <div className="previewLaptop displayFloat">
            <div className="previewBezel">
              <div className="previewNotch" />
              <div className="previewScreen">
                <div className="previewCard">
                  <BrandLogo as="div" className="brand previewBrand" />
                  <p>Join once as a member, then request verification when you are ready to post jobs.</p>
                  <div className="previewInput" />
                  <div className="previewInput" />
                  <div className="previewInput" />
                  <button type="button" className="previewButton">
                    Join Now
                  </button>
                  <small>Already have an account? Sign In</small>
                </div>
              </div>
            </div>
            <div className="previewBase" />
            <div className="floatingSupport">↻</div>
          </div>
        </section>
      </div>
    </div>
  );
}
