import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">LF</span>
          </div>
          <span className="font-semibold text-gray-900">LandFlow OS</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
            Sign in
          </Link>
          <Link href="/register" className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Get started
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
          Built for land investors
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Your land deals.<br />Organized and scored.
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Upload your PropStream CSV and LandFlow OS instantly scores every lead by motivation level — so you know exactly who to call first.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register" className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-700">
            Start free trial
          </Link>
          <Link href="/dashboard" className="text-gray-600 px-8 py-3 rounded-lg text-lg border border-gray-200 hover:bg-gray-50">
            View demo
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 text-left">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-lg">📁</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Upload any CSV</h3>
            <p className="text-gray-500 text-sm">Works with PropStream, BatchLeads, DataTree and more. No reformatting needed.</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-lg">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant scoring</h3>
            <p className="text-gray-500 text-sm">Every lead gets a 0-100 motivation score based on equity, ownership length, and more.</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-lg">📋</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Saturday Researcher</h3>
            <p className="text-gray-500 text-sm">10-point due diligence checklist with pass/fail tracking for every lead.</p>
          </div>
        </div>
      </div>
    </main>
  );
}