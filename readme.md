# (GitHub-Flavored) Markdown Editor

Basic useful feature list:

 * Ctrl+S / Cmd+S to save the file
 * Ctrl+Shift+S / Cmd+Shift+S to choose to save as Markdown or HTML
 * Drag and drop a file into here to load it
 * File contents are saved in the URL so you can share files


I'm no good at writing sample / filler text, so go write something yourself.

Look, a list!

 * foo
 * bar
 * baz

And here's some code! :+1:

```javascript
$(function(){
  $('div').html('I am a div.');
});
```

This is [on GitHub](https://github.com/jbt/markdown-editor) so let me know if I've b0rked it somewhere.


Props to Mr. Doob and his [code editor](http://mrdoob.com/projects/code-editor/), from which
the inspiration to this, and some handy implementation hints, came.

### Stuff used to make this:

 * [markdown-it](https://github.com/markdown-it/markdown-it) for Markdown parsing
 * [CodeMirror](http://codemirror.net/) for the awesome syntax-highlighted editor
 * [highlight.js](http://softwaremaniacs.org/soft/highlight/en/) for syntax highlighting in output code blocks
 * [js-deflate](https://github.com/dankogai/js-deflate) for gzipping of data to make it fit in URLs

## The help:
```
Usage: google [OPTIONS] URL
Browser wrapper script. With no options given, google searches the URL string.
  -s URL        Google search URL (default when only 1 url specified)
  -l URL        Google lucky search URL
  -f FILE       Open FILE with google-chrome
  -b BOOKMARK   Search for bookmark instead of URL
  -w URL        Use URL as address instead of google searching
  -n            Start in a new window
  -o OPTIONS    Pass in OPTIONS to browser. Quote for multiple arguments
  -B BROWSER    Set browser to BROWSER (default google-chrome)
  -M BOOKMARKS  Use file BOOKMARKS to search for bookmarks (default:
                ~/.config/google-chrome.Default/Bookmarks). Note: format expects
                google-style bookmarks, so this option may not work for other
                browsers.
  -c            Curl the url instead.
  -v            Print the full url to console before opening.
  -d            Print the full url to console instea of opening.
  -D            Run with '--disable-web-security' flag (development).
  -h            Show this menu
```

### Options:
 * -s URL  
 Google search URL (default when only 1 url specified)
 * -l URL  
 Google lucky search URL
 * -f FILE  
 Open FILE with google-chrome
 * -b BOOKMARK  
 Search for bookmark instead of URL
 * -w URL  
 Use URL as address instead of google searching
 * -n  
 Start in a new window
 * -o OPTIONS  
 Pass in OPTIONS to browser. Quote for multiple arguments
 * -B BROWSER  
 Set browser to BROWSER (default google-chrome)
 * -M BOOKMARKS  
 Use file BOOKMARKS to search for bookmarks (default:
 ~/.config/google-chrome/Default/Bookmarks). Note: format expects
 google-style bookmarks, so this option may not work for other
 browsers.
 * -c  
 Curl the url instead.
 * -v  
 Print the full url to console before opening.
 * -d  
 Print the full url to console instea of opening.
 * -D  
 Run with '--disable-web-security' flag (development).
 * -h  
 Show this menu

# Examples

### Input:  
`google let me google that for you`

### Output:  
`google-chrome google.ca/search?q=let me google that for you`


### Input:  
`google -s let me google that for you -n what I was actually working on`

### Output:  
`google-chrome google.ca/search?q=let me google that for you`
`google-chrome --new-window google.ca/search?q=what I was actually working on`


### Input:
`google -l speedtest`

### Output:  
`google-chrome google.ca/search?btnI=1&q=speedtest`


### Input:  
`google -b gmail`

### Output:  
`google-chrome https://mail.google.com/mail/u/0/`


### Input:  
`google -nb gmail`

### Output:  
`google-chrome --new-window https://mail.google.com/mail/u/0/`


### Input:  
`google -oob --option-one --option-two thestack -nb gmail`

### Output:  
`google-chrome --option-one --option-two https://stackoverflow.com/`
`google-chrome --new-window https://mail.google.com/mail/u/0/`


### Input:  
`google -oob --option-one --option-two gmail -n how to write bash scripts`

### Output:  
`google-chrome --option-one --option-two https://mail.google.com/mail/u/0/`
`google-chrome --new-window google.ca/search?q=how to write bash scripts`


### Input:  
`google -ns search for gmail -oob --option-one --option-two gmail`

### Output:  
`google-chrome --new-window google.ca/search?q=search for gmail`
`google-chrome --option-one --option-two https://mail.google.com/mail/u/0/`


### Input:  
`google -ns "how to javascript -jquery" -oob --option-one --option-two devblog`

### Output:  
`google-chrome --new-window google.ca/search?q=how to javascript -jquery`
`google-chrome --option-one --option-two https://dev.to/`


### Input:  
`google -B vivaldi -nb gmail -s this is a test`

### Output:  
`vivaldi  --new-window https://mail.google.com/mail/u/0/`
`vivaldi  google.ca/search?q=this is a test`


### Input:  
`google -c -b myapi`

### Output:  
`curl https://myapp.com/api/`


### Input:  
`google -c -o "-XPOST -H 'Content-Type: application/json' -d '{\"username\":\"pat\"}'" -b myapi`

### Output:  
`curl  -XPOST -H 'Content-Type: application/json' -d '{"username":"pat"}' https://myapp.com/api/`


### Input:  
`google -f index.html`

### Output:  
`google-chrome index.html`


### Input:  
`google -w http://localhost:8000`

### Output:  
`google-chrome http://localhost:8000`


### Input:  
`google -w stackoverflow.com`

### Output:  
`google-chrome stackoverflow.com`
