from apps.backend.src.main import app
for r in app.routes:
    try:
        p = r.path
    except Exception:
        continue
    if 'pulse' in p:
        print(p)
print('DONE')

