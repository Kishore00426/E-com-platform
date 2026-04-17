async function testOllama() {
    console.log("Testing connection to Ollama at 127.0.0.1:11434...");
    try {
        const res = await fetch('http://127.0.0.1:11434/api/tags');
        const data = await res.json();
        console.log("Connection Successful!");
        console.log("Available Models:", data.models.map(m => m.name));
    } catch (err) {
        console.error("Connection Failed!");
        console.error("Error Detail:", err.message);
        console.log("\nPossible solutions:");
        console.log("1. Make sure Ollama is actually RUNNING in your system tray.");
        console.log("2. If you are on Windows, try running this command in a terminal to allow cross-origin requests (just in case):");
        console.log("   $env:OLLAMA_ORIGINS=\"*\"; ollama serve");
    }
}

testOllama();
