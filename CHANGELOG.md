# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project uses SemVer.

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
