# The Fear Collector

A Halloween speaking-club lesson (B1): an abandoned mansion, five keys guarded by five fears,
and a front door to get out of before dawn.

**Play:** https://nataliatronza.github.io/fear-collector/

`index.html` is the whole lesson, all pictures built in. It opens from disk too.

## Group mode
Everyone types the same **room code** on the first screen and plays together: shared keys,
rooms, courage and fears, one shadow per person, and a separate clue each in the candle puzzle.
It runs on Firebase Realtime Database under `lessons/fear-collector/rooms/<code>`;
`firebase-rules.json` holds the rules for that branch.

## Editing
`index.html` is built from the parts in `src/` by `python3 build.py`.
Own pictures go in `MY_IMAGES`, the Firebase settings in `FIREBASE_CONFIG`, both at the top of the file.
