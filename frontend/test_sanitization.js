// Test the sanitization logic
const testData = [
    {
        id: "1",
        title: "Mirai",
        posterUrl: '"poster": "/mnt/data/a12956cc-905b-424b-a8a8-6d39d933110e.png"',
    },
    {
        id: "2",
        title: "Test Movie",
        posterUrl: "https://image.tmdb.org/t/p/w500/test.jpg",
    }
]

function sanitizePosterUrl(url) {
    if (!url) return ""

    if (typeof url === 'string' && url.includes('"')) {
        const urlMatch = url.match(/["']([^"']+\.(jpg|jpeg|png|webp|gif|svg))["']/i)
        if (urlMatch) return urlMatch[1]

        const httpMatch = url.match(/(https?:\/\/[^\s"']+)/i)
        if (httpMatch) return httpMatch[1]

        if (url.startsWith('/') || url.startsWith('http')) return url

        return ""
    }

    return url
}

console.log("Testing URL sanitization:")
testData.forEach(movie => {
    const cleaned = sanitizePosterUrl(movie.posterUrl)
    console.log(`  ${movie.title}: "${movie.posterUrl}" => "${cleaned}"`)
})
