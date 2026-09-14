<template>
  <main class="home-page">
    <div class="home-page__content">
      <p class="home-page__eyebrow">
        PikPak Referral Docs
      </p>
      <h1>PikPak Referral Help Center</h1>
      <p class="home-page__description">
        Browse the help center in your preferred language and jump straight into searchable
        documentation.
      </p>
      <div class="home-page__actions">
        <RouterLink
          class="button button--primary"
          to="/zh-CN"
        >
          简体中文
        </RouterLink>
        <RouterLink
          class="button button--secondary"
          to="/en-US"
        >
          English (US)
        </RouterLink>
      </div>
    </div>
  </main>
</template>
