# Yomichan Kanji Dictionaries

## Innocent Corpus Kanji Frequency

Uses the [innocent corpus frequency list](https://web.archive.org/web/20190309073023/https://forum.koohii.com/thread-9459.html#pid168613) that can be found at [foosoft](https://foosoft.net/projects/yomichan/index.html) to create a rank-based kanji frequency dictionary. This was created because the existing one is an occurence-based list.

- The displayed frequency in Yomichan will contain the frequency rank followed by the occurence count, for example `4686 (57)` for 壟 indicating it's the 4686th most common kanji and appeared 57 times total in the 5000+ novels in Innocent Corpus.

## jpdb

Using data from https://jpdb.io :

- Kanji frequency list, that tells you roughly how common a kanji is. It's less exhaustive than Innocent Corpus though.
- Kanji dictionary containing:
  - the 14 most common vocab applicable
  - the kanji decomposition according to jpdb (has inaccuracies because it's meant for memorizing keywords)
  - 漢字検定 level
  - character form similarly to jitai

## jitai

A Yomichan kanji dictionary made using the data from [jitai](https://github.com/epistularum/jitai). This allows you to see information about 旧字体, 新字体, 拡張新字体, and 標準字体 variants from the kanji page in Yomichan.

## The Kanji Map

Convert the data from [The Kanji Map](https://github.com/gabor-kovacs/the-kanji-map/tree/main/data) into a Yomichan kanji dictionary.
