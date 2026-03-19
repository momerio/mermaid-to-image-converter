import React from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
          <h2 className="font-bold text-lg">プライバシーポリシー・免責事項</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="px-6 py-5 overflow-y-auto text-sm text-zinc-700 leading-relaxed space-y-6">

          {/* プライバシーポリシー */}
          <section>
            <h3 className="font-bold text-base text-zinc-900 mb-3">プライバシーポリシー</h3>
            <p>
              本サービス「Mermaid to Image Converter」（以下「本サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。
            </p>
            <h4 className="font-semibold text-zinc-800 mt-4 mb-2">収集する情報</h4>
            <p>
              本サービスは、ユーザーの個人情報を一切収集しません。入力された Mermaid コードは、すべてブラウザ上（クライアントサイド）で処理され、外部サーバーへの送信は行われません。
            </p>
            <h4 className="font-semibold text-zinc-800 mt-4 mb-2">Cookie・トラッキング</h4>
            <p>
              本サービスは、Cookie、アクセス解析ツール、広告トラッキングなどの追跡技術を一切使用していません。
            </p>
            <h4 className="font-semibold text-zinc-800 mt-4 mb-2">外部サービスとの通信</h4>
            <p>
              本サービスは完全にクライアントサイドで動作しており、外部 API やサードパーティサービスとの通信は行いません。
              Content Security Policy（CSP）により、外部への通信は技術的にも遮断されています。
            </p>
          </section>

          {/* 免責事項 */}
          <section>
            <h3 className="font-bold text-base text-zinc-900 mb-3">免責事項</h3>
            <p>
              本サービスは「現状のまま」（as-is）で提供されており、明示または黙示を問わず、いかなる種類の保証も行いません。
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 text-zinc-600">
              <li>本サービスの利用により生じたいかなる損害についても、開発者は一切の責任を負いません。</li>
              <li>生成された画像（SVG・PNG）の正確性、完全性、特定目的への適合性について保証するものではありません。</li>
              <li>本サービスは予告なく変更、停止、または終了される場合があります。</li>
              <li>ユーザーは、本サービスを自己の責任において利用するものとします。</li>
            </ul>
          </section>

          {/* AI 利用に関する表記 */}
          <section>
            <h3 className="font-bold text-base text-zinc-900 mb-3">AI 技術の利用について</h3>
            <p>
              本サービスの開発には、AI（人工知能）技術を活用したプログラミング支援ツールを使用しています。
              具体的には、以下の工程において AI によるコーディング支援を受けています。
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 text-zinc-600">
              <li>ソースコードの設計・実装</li>
              <li>UI/UX デザインの構築</li>
              <li>セキュリティ対策の実装</li>
              <li>コードレビューおよびリファクタリング</li>
            </ul>
            <p className="mt-3">
              AI が生成したコードは、開発者によるレビューおよび動作検証を経た上で採用されています。
              ただし、AI 生成コードに起因する不具合や問題が発生する可能性を完全には排除できません。
              そのような場合においても、上記免責事項の通り、開発者は一切の責任を負いません。
            </p>
          </section>

          {/* オープンソース */}
          <section>
            <h3 className="font-bold text-base text-zinc-900 mb-3">オープンソースライセンス</h3>
            <p>
              本サービスはオープンソースソフトウェアとして公開されています。
              ソースコードは{' '}
              <a
                href="https://github.com/momerio/mermaid-to-image-converter"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 underline underline-offset-2"
              >
                GitHub リポジトリ
              </a>
              {' '}にて確認できます。
            </p>
            <p className="mt-2">
              本サービスは、Mermaid.js、React、Vite 等のオープンソースライブラリを利用しています。
              各ライブラリのライセンスについては、それぞれのプロジェクトページをご参照ください。
            </p>
          </section>

          <p className="text-xs text-zinc-400 pt-2 border-t border-zinc-100">
            最終更新日: {new Date().getFullYear()}年3月
          </p>
        </div>
      </div>
    </div>
  );
};
