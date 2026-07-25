// pnpm install 시 자동 실행된다(postinstall). 각 apps/* 아래 .env.example 이 있고
// .env.local 이 아직 없으면 그대로 복사해 만들어준다.
//
// - 이미 있는 .env.local 은 절대 덮어쓰지 않는다(개인 설정 보존).
// - .env.example 이 없는 앱은 그냥 건너뛴다.
// - 실패해도 install 자체를 막지 않는다(존재하지 않는 apps 디렉토리 등 방어적으로 처리).

const fs = require('fs');
const path = require('path');

const APPS_DIR = path.join(__dirname, '..', 'apps');

function setupApp(appName) {
  const appDir = path.join(APPS_DIR, appName);
  const examplePath = path.join(appDir, '.env.example');
  const localPath = path.join(appDir, '.env.local');

  if (!fs.existsSync(examplePath)) return;
  if (fs.existsSync(localPath)) {
    console.log(`[setup-env] apps/${appName}/.env.local 이미 존재 — 건너뜀`);
    return;
  }

  fs.copyFileSync(examplePath, localPath);
  console.log(`[setup-env] apps/${appName}/.env.example → .env.local 생성 완료`);
}

function main() {
  if (!fs.existsSync(APPS_DIR)) return;

  const apps = fs.readdirSync(APPS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory());

  for (const app of apps) {
    try {
      setupApp(app.name);
    } catch (error) {
      console.warn(`[setup-env] apps/${app.name} 처리 중 오류(무시하고 계속):`, error.message);
    }
  }
}

main();
