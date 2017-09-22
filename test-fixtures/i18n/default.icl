/*
    Sample of a translation file
    This is the default language file that the app will fallback to for example

    1 - define all my app's keys
    2 - other languages will be able to inherit from this setting block and override of course

*/


translate "default" {
    // default title of my page in en
    title = "How to i18n your app ?",
    text = 'Unless your app is strictly local in scope, you should internationalize it,
    making it easy to adapt to various languages and regions. You can then localize it—translate and otherwise adapt it so that it works well in a particular locale.
    You can internationalize your app even if it initially supports just one locale.
    For example, you might initially publish your app in English (locale code: "en").
    Then, after a few weeks or months,
    you might add support for additional locales such as French (locale code: "fr")
    and Arabic (locale code: "ar").',
    version = 3
}