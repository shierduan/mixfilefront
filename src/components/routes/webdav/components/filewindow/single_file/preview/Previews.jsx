import {PhotoProvider, PhotoView} from "react-photo-view";
import DocPreview from "./DocPreview.jsx";
import TextPreview from "./TextPreview.jsx";

export function FilePreview({file}) {
    const {mimeType, name, url, size} = file

    if (mimeType.startsWith("image/")) {
        return (
            <PhotoProvider maskClosable={true} maskOpacity={0.5}>
                <PhotoView src={url}>
                    <img src={url} alt={name}/>
                </PhotoView>
            </PhotoProvider>
        )
    }

    //audio
    if (mimeType.startsWith("audio/")) {
        return (
            <audio src={url} controls/>
        )
    }

    if (mimeType === 'application/pdf') {
        return (
            <iframe src={url} width="100%" height="600px"></iframe>
        )
    }

    const overSizedFileTip = (
        <h4 style={{
            color: '#a632f9'
        }}>
            文件过大,不支持预览
        </h4>
    )

    const docSuffixes = ['.doc', '.docx']

    if (docSuffixes.some((suffix) => name.endsWith(suffix))) {
        if (size > 1024 * 1024 * 50) {
            return overSizedFileTip
        }
        return (
            <DocPreview file={file}/>
        )
    }

    const textSuffixes = [
        // Plain Text & General
        '.txt', '.text', '.ascii', '.log', '.note', '.readme', '.nfo',

        // Configuration & Settings
        '.cfg', '.conf', '.config', '.ini', '.cnf', '.inf', '.reg', '.env', '.properties',

        // Markup & Web
        '.html', '.htm', '.xhtml', '.xml', '.xaml', '.svg', '.mxml', '.fxml',
        '.css', '.scss', '.sass', '.less',
        '.js', '.mjs', '.ts', '.tsx', '.jsx',
        '.php', '.phtml', '.php3', '.php4', '.php5', '.phps',

        // Templates & Templating Engines
        '.jinja', '.j2', '.twig', '.handlebars', '.hbs', '.mustache',
        '.erb', '.eex', '.ejs', '.pug', '.haml',

        // Data Serialization
        '.json', '.jsonl', '.json5', '.geojson', '.bson',
        '.yaml', '.yml',
        '.toml',
        '.csv', '.tsv',
        '.xml', '.plist', '.resx',
        '.ini', // Also a config format

        // Documentation & Markup
        '.md', '.markdown', '.rst', '.rest',
        '.tex', '.latex', '.ltx', '.sty', '.cls', '.bib',
        '.org', '.wiki', '.mediawiki', '.dokuwiki',
        '.textile', '.creole', '.asciidoc', '.adoc', '.asc',

        // Programming Languages (Alphabetical)
        '.c', '.h', '.cpp', '.cxx', '.cc', '.c++', '.hpp', '.hh', '.hxx', '.inl',
        '.cs', '.fs', '.fsx', '.fsi', '.vb',
        '.java', '.class', '.kt', '.kts', '.scala', '.sc', '.groovy', '.gvy', '.gy', '.gsh',
        '.py', '.pyw', '.pyx', '.pxd', '.pxi', '.pyi', '.rpy', '.pyde', '.pyp', '.pyt',
        '.rb', '.rbw', '.rake', '.gemspec',
        '.pl', '.pm', '.t', '.pod',
        '.go', '.rs', '.rlib',
        '.swift',
        '.dart',
        '.m', '.mm', '.h',
        '.pas', '.pp', '.inc', '.lpr', '.dpr',
        '.r', '.rdata', '.rds', '.rda', '.rmd', '.qmd',
        '.sh', '.bash', '.zsh', '.fish', '.csh', '.tcsh', '.ksh', '.awk', '.sed',
        '.ps1', '.psm1', '.psd1', '.ps1xml',
        '.bat', '.cmd', '.btm',
        '.sql', '.cql', '.ddl', '.dml', '.tab', '.udf', '.viw',
        '.lua', '.luau', '.wlua',
        '.cljs', '.clj', '.cljc', '.edn',
        '.erl', '.hrl', '.ex', '.exs', '.eex', '.leex',
        '.hs', '.lhs', '.hsc', '.chs',
        '.elm', '. purs', '.purs',
        '.ml', '.mli', '.mll', '.mly',
        '.nim', '.nims', '.nimble',
        '.cr', '.ecr',
        '.d', '.di',
        '.v', '.vsh', '.vh',
        '.sv', '.svh',
        '.asm', '.s', '.S', '.asmx',
        '.ll', '.hlsl', '.glsl', '.vert', '.frag', '.geom', '.tesc', '.tese', '.comp', '.spv',
        '.cmake', '.makefile', '.mk', '.gnumakefile', '.ninja', '.bazel', '.bzl', '.workspace',
        '.gradle', '.kts', '.pro', '.pri', '.qml', '.qbs',
        '.dockerfile', '.dockerignore',
        '.vagrantfile',

        // Logs & Temporary
        '.log', '.err', '.out', '.tmp', '.temp', '.cache', '.pid', '.lock',

        // Other specialized formats
        '.diff', '.patch',
        '.vcs', '.svn', '.gitignore', '.gitattributes', '.gitmodules',
        '.htaccess', '.htpasswd',
        '.desktop', '.service', '.socket', '.timer', '.mount', '.automount', '.swap', '.path', '.slice', '.scope',
        '.spec', '.rpmspec', '.dsc', '.control', '.rules', '.watch',
        '.po', '.pot', '.mo', '.lang',
        '.man', '.1', '.2', '.3', '.4', '.5', '.6', '.7', '.8', '.9', '.me', '.ms', '.so', '.pod',
        '.ics', '.vcs', '.vcd',
        '.eml', '.msg', '.mbx', '.mbox',
        '.ics', '.ical', '.icalendar',
        '.sub', '.srt', '.vtt', '.sbv', '.ass', '.ssa', '.ttml'
    ];

    if (textSuffixes.some((suffix) => name.endsWith(suffix))) {
        if (size > 1024 * 1024) {
            return overSizedFileTip
        }
        return (
            <TextPreview file={file}/>
        )
    }


    return null
}