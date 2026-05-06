import * as vscode from 'vscode';
import { SHEET_COLS, FRAME_W, FRAME_H, ANIM_ROWS } from './spritesheet';
import { getLines } from './dialogueSystem';

export class RockyView implements vscode.WebviewViewProvider, vscode.Disposable {
  private view: vscode.WebviewView | undefined;

  constructor(private ctx: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.ctx.extensionUri, 'media')]
    };
    webviewView.webview.html = this.getHtml(webviewView.webview);
  }

  private uri(webview: vscode.Webview, file: string): vscode.Uri {
    return webview.asWebviewUri(
      vscode.Uri.joinPath(this.ctx.extensionUri, 'media', file)
    );
  }

  private getHtml(webview: vscode.Webview): string {
    const css = this.uri(webview, 'rocky.css');
    const js  = this.uri(webview, 'rocky.js');
    const img = this.uri(webview, 'spritesheet.png');
    const csp = webview.cspSource;
    const lines = getLines();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none';
             img-src ${csp};
             style-src 'unsafe-inline' ${csp};
             script-src 'unsafe-inline' ${csp};">
  <link rel="stylesheet" href="${css}">
</head>
<body>
  <div id="stage">
    <canvas id="rocky-canvas"></canvas>
    <div id="dialogue" style="display:none">
      <div id="d-text"></div>
    </div>
  </div>
  <script>
    window.ROCKY_SHEET = "${img}";
    window.SHEET_COLS  = ${SHEET_COLS};
    window.FRAME_W     = ${FRAME_W};
    window.FRAME_H     = ${FRAME_H};
    window.ANIM_ROWS   = ${JSON.stringify(ANIM_ROWS)};
    window.ROCKY_LINES = ${JSON.stringify(lines)};
  </script>
  <script src="${js}"></script>
</body>
</html>`;
  }

  dispose(): void {
    this.view = undefined;
  }
}
