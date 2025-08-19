import {
  c as w,
  r as j,
  j as e,
  B,
  v as C,
  g as I,
  u as $,
  L as q,
  F as P,
} from './index-f2b0fd91.js';
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const R = [
    [
      'rect',
      {
        width: '18',
        height: '11',
        x: '3',
        y: '11',
        rx: '2',
        ry: '2',
        key: '1w4ew1',
      },
    ],
    ['path', { d: 'M7 11V7a5 5 0 0 1 10 0v4', key: 'fwvmzm' }],
  ],
  U = w('lock', R);
/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const L = [
    ['path', { d: 'M12 3v12', key: '1x0j5s' }],
    ['path', { d: 'm17 8-5-5-5 5', key: '7q97r8' }],
    ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', key: 'ih7n3h' }],
  ],
  _ = w('upload', L),
  k = (...u) => u.filter(Boolean).join(' ');
function K({
  type: u,
  onChange: p,
  onError: c,
  accept: d = '.pdf,.doc,.docx',
  label: a = 'Document',
  description: r = 'Upload a document',
  required: x = !1,
  className: v,
  disabled: g = !1,
  value: o,
}) {
  const [t, m] = j.useState({
      file: null,
      cid: null,
      url: null,
      iv: null,
      key: null,
      loading: !1,
      error: null,
    }),
    h = j.useRef(null),
    [b, N] = j.useState(!1);
  j.useEffect(() => {
    o &&
      m((s) => ({
        ...s,
        file: null,
        cid: o.cid || null,
        url: o.url || null,
        iv: o.iv || null,
        key: o.key || null,
        name: o.name || void 0,
        size: o.size,
        type: o.type,
        loading: !1,
        error: null,
      }));
  }, [o]);
  const F = async (s) => {
      var l;
      const i = ((l = s.target.files) == null ? void 0 : l[0]) || null;
      i && (await z(i));
    },
    z = async (s) => {
      const i = C(s);
      if (!i.valid) {
        const l = i.error || 'Invalid file',
          n = { ...t, error: l, loading: !1 };
        (m(n), c == null || c(l));
        return;
      }
      try {
        m((f) => ({ ...f, loading: !0, error: null }));
        const l = I(),
          n = await $(s, {
            encrypt: !0,
            onProgress: (f) => {
              console.log(`Upload progress: ${f}%`);
            },
          }),
          y = {
            file: s,
            cid: n.cid,
            url: n.url,
            iv: n.iv,
            key: n.key || null,
            name: s.name,
            size: s.size,
            type: s.type,
            loading: !1,
            error: null,
          };
        (m((f) => ({ ...f, ...y, loading: !1 })), p(y));
      } catch (l) {
        const n = l instanceof Error ? l.message : 'Failed to process file';
        (m((y) => ({ ...y, error: n, loading: !1 })), c == null || c(n));
      }
    },
    S = (s) => {
      s.stopPropagation();
      const i = {
        file: null,
        cid: null,
        url: null,
        iv: null,
        key: null,
        loading: !1,
        error: null,
      };
      (m((l) => ({ ...l, ...i, error: null, loading: !1 })),
        p(i),
        h.current && (h.current.value = ''));
    },
    D = (s) => {
      if (s === 0) return '0 Bytes';
      const i = 1024,
        l = ['Bytes', 'KB', 'MB', 'GB'],
        n = Math.floor(Math.log(s) / Math.log(i));
      return parseFloat((s / Math.pow(i, n)).toFixed(2)) + ' ' + l[n];
    },
    M = () =>
      t.loading
        ? e.jsx(q, { className: 'h-10 w-10 animate-spin text-primary' })
        : t.cid
          ? e.jsx(U, { className: 'h-10 w-10 text-green-500' })
          : e.jsx(P, { className: 'h-10 w-10 text-primary' });
  return e.jsxs('div', {
    className: k('space-y-2', v),
    children: [
      e.jsxs('div', {
        className: 'flex items-center justify-between',
        children: [
          e.jsxs('label', {
            htmlFor: `document-upload-${u}`,
            className: 'text-sm font-medium',
            children: [
              a,
              x &&
                e.jsx('span', {
                  className: 'text-destructive ml-1',
                  children: '*',
                }),
            ],
          }),
          t.file &&
            !t.loading &&
            e.jsx(B, {
              type: 'button',
              variant: 'ghost',
              size: 'sm',
              onClick: S,
              className: 'text-muted-foreground hover:text-foreground',
              disabled: g,
              children: 'Remove',
            }),
        ],
      }),
      r &&
        e.jsx('p', { className: 'text-sm text-muted-foreground', children: r }),
      e.jsxs('div', {
        className: k(
          'mt-1 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10',
          b ? 'border-primary bg-primary/5' : 'border-gray-300',
          g || t.loading ? 'opacity-50 cursor-not-allowed' : '',
          v
        ),
        onDragOver: (s) => {
          (s.preventDefault(), s.stopPropagation(), N(!0));
        },
        onDragLeave: (s) => {
          (s.preventDefault(), s.stopPropagation(), N(!1));
        },
        onClick: () => {
          var s;
          return (
            !g && !t.loading && ((s = h.current) == null ? void 0 : s.click())
          );
        },
        children: [
          e.jsx('input', {
            ref: h,
            type: 'file',
            id: `document-upload-${u}`,
            accept: d,
            className: 'hidden',
            onChange: F,
            disabled: g || t.loading,
            multiple: !1,
          }),
          t.file
            ? e.jsxs('div', {
                className:
                  'flex flex-col items-center justify-center space-y-2',
                children: [
                  M(),
                  e.jsx('div', {
                    className: 'text-sm font-medium truncate max-w-xs',
                    children: t.file.name,
                  }),
                  e.jsxs('div', {
                    className: 'text-xs text-muted-foreground',
                    children: [
                      D(t.file.size),
                      t.cid && ' • Securely stored on IPFS',
                    ],
                  }),
                  t.error &&
                    e.jsx('div', {
                      className: 'text-xs text-destructive',
                      children: t.error,
                    }),
                ],
              })
            : e.jsxs('div', {
                className:
                  'flex flex-col items-center justify-center space-y-2',
                children: [
                  e.jsx(_, { className: 'h-8 w-8 text-muted-foreground' }),
                  e.jsxs('div', {
                    className: 'text-sm',
                    children: [
                      e.jsx('span', {
                        className: 'font-medium text-primary',
                        children: 'Click to upload',
                      }),
                      ' or drag and drop',
                    ],
                  }),
                  e.jsx('div', {
                    className: 'text-xs text-muted-foreground',
                    children: d ? `Supported formats: ${d}` : 'Any file format',
                  }),
                ],
              }),
        ],
      }),
    ],
  });
}
const A = ({
  documents: u,
  handleDocumentChange: p,
  handleDocumentError: c,
  getDocumentLabel: d,
}) =>
  e.jsxs('div', {
    className: 'space-y-6',
    children: [
      e.jsx('h2', {
        className: 'text-xl font-semibold',
        children: 'Required Documents',
      }),
      e.jsx('p', {
        className: 'text-muted-foreground',
        children:
          'Upload all required documents for your export. All documents are required.',
      }),
      e.jsx('div', {
        className: 'space-y-6 bg-muted/50 p-6 rounded-lg border',
        children: Object.entries(u).map(([a, r]) =>
          e.jsxs(
            'div',
            {
              className: 'space-y-3 pb-4 border-b last:border-b-0 last:pb-0',
              children: [
                e.jsxs('div', {
                  className: 'flex items-center gap-3',
                  children: [
                    e.jsx('div', {
                      className: `w-8 h-8 rounded-full flex items-center justify-center ${r.file ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300'}`,
                      children: r.file
                        ? '✓'
                        : a === 'license'
                          ? '1'
                          : a === 'invoice'
                            ? '2'
                            : a === 'qualityCert'
                              ? '3'
                              : '4',
                    }),
                    e.jsx('h3', {
                      className: 'font-medium text-gray-900 dark:text-white',
                      children: d(a),
                    }),
                  ],
                }),
                e.jsx('div', {
                  className: 'pl-11',
                  children: e.jsx(K, {
                    type: a,
                    onChange: (x) => p(a, x),
                    onError: (x) => c(a, x),
                    accept: '.pdf,.doc,.docx',
                    label: d(a),
                    description: `Upload ${d(a).toLowerCase()}`,
                    required: !0,
                    value: {
                      file: r.file,
                      cid: r.cid,
                      url: r.url,
                      iv: r.iv,
                      key: r.key,
                      name: r.name,
                      size: r.size,
                      type: r.type,
                    },
                  }),
                }),
              ],
            },
            a
          )
        ),
      }),
    ],
  });
export { A as default };
