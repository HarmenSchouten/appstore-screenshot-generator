# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project uses SemVer.

## [2.2.0](https://github.com/HarmenSchouten/appstore-screenshot-generator/compare/v2.1.0...v2.2.0) (2026-04-05)


### Features

* Add zoom functionality to preview component ([#35](https://github.com/HarmenSchouten/appstore-screenshot-generator/issues/35)) ([7d30058](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/7d300589e3c1d7077bee51e55bd5e5f7d1a5573d))
* redesign sidebar into topbar and sidebar with clear separation of UI components ([#33](https://github.com/HarmenSchouten/appstore-screenshot-generator/issues/33)) ([7376d1b](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/7376d1b830e68867776d413bfd8fc5a3a785af95))


### Bug Fixes

* Update project and language management to use mutate methods ([#34](https://github.com/HarmenSchouten/appstore-screenshot-generator/issues/34)) ([3ee58b0](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/3ee58b099b7718367b3f70ce233e93322faf6b51))

## [2.1.0](https://github.com/HarmenSchouten/appstore-screenshot-generator/compare/v2.0.1...v2.1.0) (2026-04-01)


### Features

* Add Empty State Phone Frame  ([#31](https://github.com/HarmenSchouten/appstore-screenshot-generator/issues/31)) ([0c2c880](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/0c2c880f2bf47bd0151f27277f397bcc13aff4f8))
* enhance EmptyState component with props for customizable title and subtitle ([677a00f](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/677a00f36db7d3ff3763028235bebe8d4ee3fa36))
* implement language management mutations and update Sidebar component to use TanStack Query ([cda64a5](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/cda64a5fa2ad5a05fe017a68f323f3d35556f5b2))
* implement project mutation hooks for server state management with TanStack Query ([2f41f07](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/2f41f07f0e745aec9bd9ce82bddc0ac10865c1ae))
* integrate TanStack Query for server state management and add query utilities ([cc716c3](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/cc716c347583cdf548f5699ad8f9011ad693e541))
* introduce ErrorBoundary and useInitData for improved error handling and server state management ([b6e9359](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/b6e935910045961d3f9a0d27dc6f25ed00e500a6))


### Bug Fixes

* add error handling for asset upload failures in MediaManagerModal ([225c835](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/225c8350ed09b6c94a288f286d44efa983d5eb8a))
* correct typo in handleSwitchProject function name ([7d41dd9](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/7d41dd98c81f0b1155c15a3fc814567f22c1bef8))
* enhance AppShell to handle error state from useInitData ([6c23d91](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/6c23d91294c1c9153beb152942d43c1318e81c7d))
* enhance error handling in rename and delete asset functions ([4bd5a56](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/4bd5a56449652e8a1402819551780057f07c6f49))
* ensure flush registration is cleared on unmount in useConfigAutoSave hook ([0552450](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/05524504e823cbc3c1642997afdbfe244c962e23))
* improve error handling and state management in useConfigAutoSave hook ([52b4f63](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/52b4f63fb06f5a87f911d05b54be1647da486000))
* improve error handling in generateStream and uploadAsset functions ([26a7a98](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/26a7a98e237ef11d1e230d1c13dc19a829217226))
* refactor project mutation handlers to use callbacks instead of async/await ([5ebbbce](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/5ebbbcebce83df06051ba79b6efeff7c56adc2e2))
* refactor useLastGeneratedQuery to eliminate useEffect and improve state synchronization ([04d10d0](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/04d10d060b64febd4f23755cb8aa7cd025ef273c))
* replace useEffect with synchronous hydration in useInitData for improved state management ([eb9342e](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/eb9342ec1275fcb71c90f6eebcd2ad8e3f611b67))
* update comments to clarify useInitData and ErrorBoundary roles in server state management ([40ebb03](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/40ebb03f0bf2c0a5bf18fb6fcd10d6c2f4984a95))
* update root creation logic for HMR support and import Root type ([652fbbf](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/652fbbf4822f661f8d56ea9fc27283d37b02b0b5))


### Refactoring

* implement generation management with TanStack Query and refactor related components ([6232585](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/6232585c6f2bc4cdea7ccd167435594551bdb969))
* integrate TanStack Query for asset management and replace store-level refresh logic ([1b4bdce](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/1b4bdcea7f4f1dea26e92716e8ae549878083bc5))
* Introduce tanstack query for server state management ([#29](https://github.com/HarmenSchouten/appstore-screenshot-generator/issues/29)) ([c40d3f1](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/c40d3f1afeb86e08a36919309740019b288bcbd0))
* replace config store set calls with a proper auto save loop using react query ([4b11040](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/4b11040d00ececfd164d3aabf6ecf7b56791ec16))
* replace project management with TanStack Query hooks and update Sidebar and ProjectModal components ([9335605](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/9335605a969a52ebc03d8b9f3f9920e363feeaef))
* update selectors to use constants for empty screenshots and default dimensions ([a92003b](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/a92003b314942ab35aafd62583ed802b5ad2c533))

## [2.0.1](https://github.com/HarmenSchouten/appstore-screenshot-generator/compare/v2.0.0...v2.0.1) (2026-03-27)


### Bug Fixes

* Add drag-and-drop modifiers and resolve module paths ([#24](https://github.com/HarmenSchouten/appstore-screenshot-generator/issues/24)) ([d71fdf3](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/d71fdf328fd609fd722d5fff5e5d024d70cc762e))
* Handle image border radius in pixels ([#26](https://github.com/HarmenSchouten/appstore-screenshot-generator/issues/26)) ([3719e31](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/3719e3136be46991346cb4acebdb4642ae2e2535))

## [2.0.0](https://github.com/HarmenSchouten/appstore-screenshot-generator/compare/v1.0.1...v2.0.0) (2026-03-24)


### ⚠ BREAKING CHANGES

* Implement layer-based composition system for screenshots ([#14](https://github.com/HarmenSchouten/appstore-screenshot-generator/issues/14))

### Features

* add background layer editor and background layer renderer component ([98da557](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/98da5579b565a1d8725b824b6102b750f4a34cce))
* add empty state screen with layer icons ([427f6c6](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/427f6c654b2dbdb4869e5f4c076834e445ba2b38))
* add info button to ScreenshotEditor for layer composition guidance ([1cf0f9e](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/1cf0f9e5c631d184cf6f865feb9d8db141ee3bca))
* add path aliases for lib directory in tsconfig ([7a3dd06](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/7a3dd0657897e5f590c3404b1627a76852766aa7))
* add SectionHeading component for consistent section titles ([143febc](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/143febc5e76ab7df034e4c9fbe3a98afa5932e9d))
* add SegmentedControl component and update input exports ([74559c2](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/74559c2b72c0206111b2f354ff658df43a295942))
* complete all new layer types and remove the obsolete old types ([f4d9b86](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/f4d9b869761324f4db5bb1c76a753717a48ff4ae))
* enhance BackgroundEditor with drag-and-drop color stops and CSS editing capabilities ([9d975c5](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/9d975c575621be9018cff380440e83aa89d17303))
* enhance screenshot generation with role classification and PNG dimension reading ([235324e](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/235324e381cc724235ea0ebb4959f67c1d925448))
* implement glow layer system with editor and renderer components replacing the old components ([ab3604a](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/ab3604a736d64863a93ccc34a864d1ba82a18db8))
* implement image layer editor and renderer replacing mascot editor ([66faa61](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/66faa61611d8cde2505b3c96584fc6d3f80f71c6))
* Implement layer-based composition system for screenshots ([#14](https://github.com/HarmenSchouten/appstore-screenshot-generator/issues/14)) ([4237e0c](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/4237e0c983c8889f45e8c4de4d3add5ce1f0d424))
* implement new shape layer with compatible editor replacing the old setup ([bbf20a2](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/bbf20a2d1e9cc53d422cab0c1298760df72934e5))
* implement PhoneFrame editor and integrate into layer detail view ([85b5b04](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/85b5b04a774d0248d215ef05e9f1b642a7246697))
* implement role-based screenshot generation and update related components ([8c67dd9](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/8c67dd9b42aacf92398e08e79aa35430ad8c366e))
* implement TextEditor component and enhance TextLayer with additional properties ([7822328](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/78223283354c5108ed280b0073308cd5dea4adc9))
* remove obsolete FeatureGraphic component and related functionality ([6275937](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/6275937e854c5fce245891b79f7ed98df2d09dfa))
* render layers in screenshot editor. Change order with drag and drop with option to delete and duplicate. Add new layers using button ([6259f5e](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/6259f5e8a386de88b65c402f61430d4b889dcaa0))
* start with updated screenshot type and new layer type and render components for layers ([b8beed3](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/b8beed315e0ad420785fe0255c0d1106bfde285c))
* update styling of optgroup labels ([bae5e51](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/bae5e5166b453382ae85c0777add70041c3d8c2d))
* wire in layer detail component when user clicks on layer ([fd50d7d](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/fd50d7de33fdc0a497381e79d6ef82cb431bfdf6))


### Bug Fixes

* add missing button type attributes for delete actions ([2cf436e](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/2cf436eebafa662eb14d046020ac9a66927400c9))
* add screenshot and feature graphic now work properly. Feature graphic selection from url works now too ([4e80a11](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/4e80a113a1e46c22638af340300021ebee1fb3ef))
* fix comments left by Copilot ([19eaeb8](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/19eaeb889981dc73d43e205bce3b1d7d57a03961))
* keep reactive variables outside of snapshot state ([38ad8ec](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/38ad8ecf2476ad1788a23a5c975084b4593899cf))
* remove zIndex and add id to base layer props. Fix model type of phone frame layer props ([b7e1e49](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/b7e1e493407d28e81c1d783130522fd7cc602b5c))


### Refactoring

* clean up url parsing and start using react-router-dom ([851bf42](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/851bf42d0356f4788c7db7ac0e9266c5802bc932))
* move copy platform config and add language functions to config store slice ([de920a0](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/de920a020f5f5b84870c98a58bcdad4311a45a27))
* redesign delete layer action ([03c65d6](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/03c65d6e9dcbd61e83c70dc91e03c16b851322c6))
* remove image categories ([f36e9e6](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/f36e9e684034a57d72b3a205b9c06a145fbfc561))
* remove TextBlockLayer and simplify text handling in Screenshot component ([d9ea18b](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/d9ea18b657ca8e230906b8e6a8bd57777c2072d5))
* remove unused subtitle and index props from SidebarItemCard ([302cc23](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/302cc23a21e5cae88e1aaa076150af841cca458f))
* simplify ProjectModal by integrating project management functions directly ([c494f72](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/c494f729699c0d40535d67e8972a46eec2807d49))
* update layer naming strategy ([45807e5](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/45807e5657b8d92ffe9d40c82a119e2ee5b888ea))
* update SegmentedControl to support number type for options ([4210698](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/4210698e751ed404983f19a27ed0eace07102cbd))
* use zustand as store ([ce8f67b](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/ce8f67bbd53a28ead1d66ec230dd9c0a3ec3b978))

## [1.0.1](https://github.com/HarmenSchouten/appstore-screenshot-generator/compare/v1.0.0...v1.0.1) (2026-03-21)


### Bug Fixes

* adjust formatting in README.md for improved readability ([609e53e](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/609e53e716005aa3963f7d8a7a190359527f796a))
* adjust formatting in README.md for improved readability ([0b43359](https://github.com/HarmenSchouten/appstore-screenshot-generator/commit/0b43359191e7aea2076b7206cd1d9673c82ad374))

## [1.0.0] - 2026-03-19

### Added

- Public open source baseline: CI verification workflow, issue templates, PR
  template.
- Contributor documentation and docs index/history.

### Changed

- README simplified for faster onboarding.
- Verification scripts aligned for local and CI use.
