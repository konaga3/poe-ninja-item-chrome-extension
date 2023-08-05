# poe-ninja-item-chrome-extension
## Chrome拡張機能導入
・Zipファイルをダウンロードして展開<br>
・Chromeの拡張機能管理を選択<br>
・パッケージ化されていない拡張機能の読み込みで、展開したフォルダ（manifest.jsonがあるフォルダ）を選択

## 使い方
・poe.ninja/buildsでキャラクター画面（SCTradeリーグ）に行く<br>
・検索したいアイテムにカーソルを合わせると、「Copy」と出てくるのでそれをクリックしてコピー<br>
・上に表示されている空のテキストボックスにペーストして「URL生成」を押す<br>
・アイテムについているModで検索した状態のpoe.tradeサイトが表示される<br>
![e130c4700da54301550494f552ed7bd3](https://github.com/konaga3/poe-ninja-item-chrome-extension/assets/141460315/c3a92fb5-2ce6-4838-83ec-e148fdf4a1cd)
<br>
## 対応中
・Statsにおいて（Local）かどうかを判定しないと武器のModが正しく検索されない<br>
→アイテムカテゴリーを判定して武器かどうかで（Local）を付与<br>
・ていうかDPSで武器検索したい<br>
→Local Addedの値とAPSからP/EDPSを計算して検索に追加<br>
→でもスペルワンドとかにも適用されてしまうかもしれないから、適当な最低P/EDPSを設定して以下なら追加しないなどの実装方法
