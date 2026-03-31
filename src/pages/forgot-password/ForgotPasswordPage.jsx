import { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import AnimatedCharactersLoginPage from '../../components/ui/animated-characters-login-page.jsx';
import OTPVerification from '../../components/ui/otp-verify.jsx';
import { ROUTES } from '../../shared/constants/routes.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import { navigateWithScroll } from '../../shared/lib/navigation/navigateWithScroll.js';
import { useForgotPasswordForm } from '../../features/auth/hooks/useForgotPasswordForm.js';
import LanguageSwitcher from '../../shared/ui/LanguageSwitcher.jsx';
import BrandLogo from '../../shared/ui/BrandLogo.jsx';

function ForgotPasswordAlert({ message, type }) {
  if (!message) {
    return null;
  }

  return <div className={type === 'success' ? 'authAlert success' : 'authAlert error'}>{message}</div>;
}

function AuthField({ label, icon: Icon, children }) {
  return (
    <label className="animatedAuthField">
      <span className="animatedAuthFieldLabel">{label}</span>
      <div className="animatedAuthFieldControl">
        {Icon ? <Icon className="animatedAuthFieldIcon" aria-hidden="true" /> : null}
        {children}
      </div>
    </label>
  );
}

function ForgotPasswordSteps({ isResetStep, t }) {
  return (
    <div className="forgotAuthSteps" aria-label={t('Forgot password steps')}>
      <div className={`forgotAuthStep ${isResetStep ? '' : 'is-active'}`}>
        <span>01</span>
        <strong>{t('Send code')}</strong>
      </div>
      <div className={`forgotAuthStep ${isResetStep ? 'is-active' : ''}`}>
        <span>02</span>
        <strong>{t('Reset password')}</strong>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage({ navigate }) {
  const { t } = useI18n();
  const [focusMode, setFocusMode] = useState('');
  const {
    form,
    activeStep,
    showPassword,
    showConfirmPassword,
    isSubmitting,
    isResending,
    feedback,
    sentToEmail,
    setFieldValue,
    setShowPassword,
    setShowConfirmPassword,
    submitEmailStep,
    submitResetStep,
    resendCode,
    goToRequestStep,
    goToLogin
  } = useForgotPasswordForm(navigate);

  const isResetStep = activeStep === 'reset';
  const homeAction = (
    <button
      type="button"
      className="animatedAuthHomeButton interactive"
      onClick={() => navigate(ROUTES.home)}
    >
      <ArrowLeft size={16} aria-hidden="true" />
      <span>{t('Return home')}</span>
    </button>
  );

  return (
    <AnimatedCharactersLoginPage
      shellClassName="animatedAuthShellLogin"
      stageClassName="animatedAuthStageLogin"
      panelShellClassName="animatedAuthPanelShellLogin"
      panelClassName="animatedAuthPanelLogin animatedAuthPanelForgot"
      topBar={
        <div className="animatedAuthTopActions">
          {homeAction}
          <LanguageSwitcher className="animatedAuthLanguageSwitcher" />
        </div>
      }
      brand={
        <BrandLogo
          href={ROUTES.home}
          className="brand animatedAuthBrand animatedAuthBrandMobileOnly"
          onClick={(event) => navigateWithScroll(event, ROUTES.home, navigate)}
        />
      }
      eyebrow=""
      title={isResetStep ? t('Reset password') : t('Forgot password?')}
      subtitle={
        isResetStep
          ? t('Enter the code from your email and set a new password for your account.')
          : t('We will send a verification code to your email so you can safely reset your password.')
      }
      footer={
        <p className="animatedAuthSwitch">
          {t('Remembered your password?')}{' '}
          <button type="button" className="animatedAuthInlineLink interactive" onClick={goToLogin}>
            {t('Sign In')}
          </button>
        </p>
      }
      heroBrand={
        <BrandLogo
          href={ROUTES.home}
          className="brand animatedAuthStageBrand"
          onClick={(event) => navigateWithScroll(event, ROUTES.home, navigate)}
        />
      }
      heroEyebrow=""
      heroTitle=""
      heroDescription=""
      heroHighlights={[]}
      heroPanelEyebrow=""
      heroPanelTitle=""
      heroPanelStatus=""
      heroPanelDescription=""
      isTyping={focusMode === 'identity' || focusMode === 'code'}
      isPasswordVisible={showPassword || showConfirmPassword}
      hasPasswordValue={Boolean(form.password || form.confirmPassword)}
    >
      <div className="forgotAuthFormShell">
        <button type="button" className="forgotAuthBackLink interactive" onClick={goToLogin}>
          <ArrowLeft size={16} aria-hidden="true" />
          <span>{t('Back to sign in')}</span>
        </button>

        <ForgotPasswordAlert message={feedback.message} type={feedback.type} />
        <ForgotPasswordSteps isResetStep={isResetStep} t={t} />

        {!isResetStep ? (
          <form className="animatedAuthForm" onSubmit={submitEmailStep}>
            <AuthField label={t('Email address')} icon={Mail}>
              <input
                type="email"
                className="animatedAuthTextInput"
                value={form.email}
                onChange={(event) => setFieldValue('email', event.target.value)}
                onFocus={() => setFocusMode('identity')}
                onBlur={() => setFocusMode('')}
                placeholder={t('Please enter your email')}
                autoComplete="email"
                required
              />
            </AuthField>

            <button type="submit" className="animatedAuthSubmit interactive" disabled={isSubmitting}>
              <span>{isSubmitting ? t('Sending Code...') : t('Send Verification Code')}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </form>
        ) : (
          <form className="animatedAuthForm forgotAuthResetForm" onSubmit={submitResetStep}>
            <OTPVerification
              title={t('Verification code')}
              description={t('Code destination')}
              email={sentToEmail || form.email}
              value={form.code}
              onChange={(value) => setFieldValue('code', value)}
              onResend={resendCode}
              isResending={isResending}
              resendLabel={t('Resend code')}
              resendLoadingLabel={t('Resending...')}
              helperText={t('Enter the 4-digit code from your email.')}
              onFocus={() => setFocusMode('code')}
              onBlur={() => setFocusMode('')}
            />

            <div className="animatedAuthGrid forgotAuthPasswordGrid">
              <AuthField label={t('New password')} icon={LockKeyhole}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="animatedAuthTextInput animatedAuthPasswordInput"
                  value={form.password}
                  onChange={(event) => setFieldValue('password', event.target.value)}
                  onFocus={() => setFocusMode('password')}
                  onBlur={() => setFocusMode('')}
                  placeholder={t('Please enter new password')}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="animatedAuthPasswordToggle interactive"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setShowPassword((currentState) => !currentState)}
                  aria-label={showPassword ? t('Hide password') : t('Show password')}
                  title={showPassword ? t('Hide password') : t('Show password')}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </AuthField>

              <AuthField label={t('Confirm password')} icon={LockKeyhole}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="animatedAuthTextInput animatedAuthPasswordInput"
                  value={form.confirmPassword}
                  onChange={(event) => setFieldValue('confirmPassword', event.target.value)}
                  onFocus={() => setFocusMode('password')}
                  onBlur={() => setFocusMode('')}
                  placeholder={t('Retype new password')}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="animatedAuthPasswordToggle interactive"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setShowConfirmPassword((currentState) => !currentState)}
                  aria-label={showConfirmPassword ? t('Hide password') : t('Show password')}
                  title={showConfirmPassword ? t('Hide password') : t('Show password')}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </AuthField>
            </div>

            <div className="forgotAuthActionRow">
              <button
                type="button"
                className="forgotAuthSecondaryButton interactive"
                onClick={goToRequestStep}
              >
                {t('Change email')}
              </button>

              <button type="submit" className="animatedAuthSubmit interactive" disabled={isSubmitting}>
                <span>{isSubmitting ? t('Updating Password...') : t('Save New Password')}</span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </form>
        )}
      </div>
    </AnimatedCharactersLoginPage>
  );
}
