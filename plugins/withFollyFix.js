const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withFollyFix = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const filePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(filePath, 'utf8');

      const follyFixCode = `
    # Force disable coroutines in Folly to avoid missing 'folly/coro/Coroutine.h' header error
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['OTHER_CPLUSPLUSFLAGS'] ||= ['$(inherited)']
        config.build_settings['OTHER_CPLUSPLUSFLAGS'] << '-DFOLLY_CFG_NO_COROUTINES=1'
      end
    end`;

      if (!contents.includes('FOLLY_CFG_NO_COROUTINES')) {
        const postInstallMatch = /post_install\s+do\s+\|installer\|/;
        if (postInstallMatch.test(contents)) {
          contents = contents.replace(
            /post_install\s+do\s+\|installer\|/,
            `post_install do |installer|${follyFixCode}`
          );
          fs.writeFileSync(filePath, contents, 'utf8');
        }
      }

      return config;
    },
  ]);
};

module.exports = withFollyFix;
