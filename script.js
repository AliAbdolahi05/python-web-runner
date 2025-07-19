// Initialize CodeMirror
const editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true,
    mode: 'javascript',
    theme: 'default',
    extraKeys: { 'Ctrl-Space': 'autocomplete' },
});

// Language to mode mapping
const languageModes = {
    javascript: 'javascript',
    python: 'python',
    cpp: 'text/x-c++src',
    java: 'text/x-java',
    php: 'php',
    htmlmixed: 'htmlmixed',
};

// Language to file extension mapping
const languageExtensions = {
    javascript: 'js',
    python: 'py',
    cpp: 'cpp',
    java: 'java',
    php: 'php',
    htmlmixed: 'html',
};

// Update editor mode based on language selection
document.getElementById('language-select').addEventListener('change', (e) => {
    const language = e.target.value;
    editor.setOption('mode', languageModes[language]);
    document.getElementById('preview').classList.toggle('hidden', language !== 'htmlmixed');
    document.getElementById('output').classList.toggle('hidden', language === 'htmlmixed');
});

// Update theme based on selection
document.getElementById('theme-select').addEventListener('change', (e) => {
    editor.setOption('theme', e.target.value);
});

// Run code using Piston API
document.getElementById('run-btn').addEventListener('click', async () => {
    const code = editor.getValue();
    const language = document.getElementById('language-select').value;

    if (language === 'htmlmixed') {
        // For HTML, update iframe content
        const iframe = document.getElementById('preview');
        iframe.contentDocument.open();
        iframe.contentDocument.write(code);
        iframe.contentDocument.close();
    } else {
        // For other languages, use Piston API
        try {
            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: language,
                    version: '*',
                    files: [{ content: code }],
                }),
            });
            const result = await response.json();
            document.getElementById('output').innerText = result.run?.output || result.compile?.output || 'Error executing code';
        } catch (error) {
            document.getElementById('output').innerText = 'Error: Could not connect to server';
        }
    }
});

// Download code as file
document.getElementById('download-btn').addEventListener('click', () => {
    const code = editor.getValue();
    const language = document.getElementById('language-select').value;
    const extension = languageExtensions[language] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
});
