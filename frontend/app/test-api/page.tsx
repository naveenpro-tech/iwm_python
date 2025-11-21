export default function TestPage() {
    return (
        <div style={{ padding: '20px', background: '#1a1a1a', color: '#fff', minHeight: '100vh' }}>
            <h1>API Test Page</h1>
            <div id="results"></div>
            <script dangerouslySetInnerHTML={{
                __html: `
          async function testAPI() {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '<p>Fetching movies...</p>';
            
            try {
              const response = await fetch('http://localhost:8000/api/v1/movies?page=1&limit=5');
              const data = await response.json();
              
              resultsDiv.innerHTML = '<h2>API Response:</h2><pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (error) {
              resultsDiv.innerHTML = '<p style="color: red;">Error: ' + error.message + '</p>';
            }
          }
          
          testAPI();
        `
            }} />
        </div>
    );
}
