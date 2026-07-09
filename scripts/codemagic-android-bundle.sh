#!/usr/bin/env bash
# Build release AAB with JDK 21 (required by Capacitor 7 / AGP 8.7+).
# Usage: ./scripts/codemagic-android-bundle.sh <path-to-android-folder>
set -exuo pipefail

ANDROID_DIR="${1:?android folder required}"
cd "$ANDROID_DIR"
chmod +x gradlew

if command -v /usr/libexec/java_home >/dev/null 2>&1; then
  export JAVA_HOME="$(/usr/libexec/java_home -v 21)"
fi

if [ -z "${JAVA_HOME:-}" ]; then
  echo "ERROR: JDK 21 not found. Set environment.java: 21 in Codemagic workflow."
  exit 1
fi

java -version
echo "JAVA_HOME=${JAVA_HOME}"

echo "sdk.dir=${ANDROID_SDK_ROOT}" > local.properties

touch gradle.properties
if grep -q '^org.gradle.java.home=' gradle.properties; then
  sed -i.bak "s|^org.gradle.java.home=.*|org.gradle.java.home=${JAVA_HOME}|" gradle.properties
  rm -f gradle.properties.bak
else
  echo "org.gradle.java.home=${JAVA_HOME}" >> gradle.properties
fi

./gradlew bundleRelease --no-daemon
