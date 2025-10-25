# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - link "Siddu Home" [ref=e5] [cursor=pointer]:
          - /url: /
          - img [ref=e6]
          - generic [ref=e8]: Siddu
        - generic [ref=e9]:
          - link "Movies" [ref=e10] [cursor=pointer]:
            - /url: /movies
          - link "TV Shows" [ref=e11] [cursor=pointer]:
            - /url: /tv-shows
          - link "People" [ref=e12] [cursor=pointer]:
            - /url: /people
          - link "Critics" [ref=e13] [cursor=pointer]:
            - /url: /critics
          - link "Pulse" [ref=e14] [cursor=pointer]:
            - /url: /pulse
          - link "Cricket" [ref=e15] [cursor=pointer]:
            - /url: /cricket
          - link "Explore" [ref=e16] [cursor=pointer]:
            - /url: /explore
      - generic [ref=e17]:
        - button "Open search" [ref=e18] [cursor=pointer]:
          - img
        - button "User profile" [ref=e19] [cursor=pointer]:
          - img "Test User" [ref=e21]
  - main [ref=e22]:
    - main [ref=e23]:
      - heading "Welcome, Test User" [level=1] [ref=e24]
  - region "Notifications (F8)":
    - list
  - button "Open Next.js Dev Tools" [ref=e30] [cursor=pointer]:
    - img [ref=e31]
  - alert [ref=e34]
```