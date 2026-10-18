# 見出しの書体(Murecho)を、太さ 1 つの woff2 2 本に絞る。配る物には入れない(作り直す時だけ使う)。
#   元: google/fonts の ofl/murecho/Murecho[wght].ttf(SIL OFL 1.1)
#   使い方: pip install fonttools brotli
#           python3 packages/css/scripts/subset-font.py <Murecho[wght].ttf> packages/css/src/fonts
#   base: 英数字、記号、かな、全角の英数字(約 26 KB)。kanji: 元の書体にある漢字の全部(約 260 KB)
#   fonts.css の unicode-range で分けているので、漢字の無い見出しは base だけを読む。
import sys
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

WEIGHT = 800
src, outdir = sys.argv[1], sys.argv[2]

latin = list(range(0x20, 0x7F)) + [0xA0, 0xA9, 0xB7, 0xD7, 0xF7] + list(range(0x2010, 0x2027)) + [
    0x2030, 0x2032, 0x2033, 0x203B, 0x2116, 0x2122, 0x2190, 0x2191, 0x2192, 0x2193, 0x2212, 0x301C]
kana = list(range(0x3000, 0x3040)) + list(range(0x3041, 0x3097)) + list(range(0x3099, 0x3100)) + list(range(0xFF01, 0xFF5F))
kanji = [u for u in TTFont(src).getBestCmap() if 0x3400 <= u <= 0x9FFF or 0xF900 <= u <= 0xFAFF]

for name, cps in [("base", latin + kana), ("kanji", kanji)]:
    font = instancer.instantiateVariableFont(TTFont(src), {"wght": WEIGHT})
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["kern", "palt", "vert", "vrt2", "liga", "locl", "ccmp"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    opts.hinting = False
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=cps)
    sub.subset(font)
    font.flavor = "woff2"
    font.save(f"{outdir}/murecho-{WEIGHT}-{name}.woff2")
    print(name, len(font.getBestCmap()))
