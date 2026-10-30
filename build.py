#!/usr/bin/env python3
"""Glue src/ parts into one self-contained index.html."""
from pathlib import Path
src = Path(__file__).parent / 'src'
read = lambda n: (src / n).read_text(encoding='utf-8')
html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Fear Collector</title>
<script>
{read('images.js')}
{read('config.js')}
</script>
<meta name="description" content="A Halloween speaking-club lesson, B1: escape an abandoned mansion, find four keys guarded by four fears, and get out at dawn.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:ital,wght@0,400;0,500;0,700;0,800;0,900;1,400;1,500;1,700&family=Cinzel:wght@400;700;900&display=swap" rel="stylesheet">
<style>
{read('style.css')}
</style>
</head>
<body>
{read('body.html')}
<script>
{read('art.js')}
</script>
<script>
{read('edges.js')}
</script>
<script>
{read('embedded.js')}
</script>
<script>
{read('app.js')}
</script>
</body>
</html>
"""
(Path(__file__).parent / 'index.html').write_text(html, encoding='utf-8')
print('index.html', len(html.encode('utf-8')) // 1024, 'KB')
