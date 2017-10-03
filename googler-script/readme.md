# Google-chrome wrapper script  

A bash wrapper for browser searching from the command line.  

## Features:  
 * **Simple to use:** For basic usage, it's as simple as `google cat videos`.
 * **Powerful:** Use it for advanced chrome features, development, and tie it into those API curls.  
 * **Flexible:** Wrap your favourite links in aliases, throw it in a "starting the workday script", or add a shortcut key to it for rapid Redditing.

## Usage:  

`google [OPTIONS [ARGS]] [URL]...`  

| Options         | Description                                                   |
|              ---|---                                                            |
| -s URL          | Google search URL (default when only 1 url specified)         |
| -l URL          | Google lucky search URL (straight to first search result)     |
| -f FILE         | Open FILE with google-chrome                                  |
| -b BOOKMARK     | Search for bookmark instead of URL                            |
| -w URL          | Use URL as address instead of google searching                |
| -n              | Start in a new window                                         |
| -o OPTIONS      | Pass in OPTIONS to browser. Quote for multiple arguments      |
| -B BROWSER      | Set browser to BROWSER (default google-chrome)                |
| -M BOOKMARKS    | Use file BOOKMARKS to search for bookmarks (default:<br> ~/.config/google-chrome/Default/Bookmarks). Note: format<br>expects google-style bookmarks, so this option may not work<br>for other browsers.    |
| -c              | Curl the url instead.                                         |
| -P              | Use plus symbol (+) instead of spaces in URLS (compatibility) |
| -v              | Print the full url to console before opening.                 |
| -d              | Print the full url to console instea of opening.              |
| -D              | Run with '--disable-web-security' flag (development).         |
| -h              | Show this menu                                                |

Note: OPTIONS are comsumed as soon as a mode flag (-s, -l,-b) is parsed, meaning 
options must preceed modes.
For example:
```
google -nl test -s this is a search
```  
executes:
```
google-chrome --new-window google.ca/search?btnI=1&q=test
google-chrome google.ca/search?q=this is a search
```  

whereas:
```
google -ln test -s this is a search
```  
executes:
```
google-chrome google.ca/search?btnI=1&q=test
google-chrome --new-window google.ca/search?q=this is a search
```  



## Examples

**Input:**  
```
google let me google that for you
```  
**Output:**  
```
google-chrome google.ca/search?q=let me google that for you
```  


**Input:**  
```
google -l youtube
```  
**Output:**  
```
google-chrome google.ca/search?btnI=1&q=youtube
```  


**Input:**  
```
google -b gmail
```  
**Output:**  
```
google-chrome https://mail.google.com/mail/u/0/
```  


**Input:**  
```
google -nb gmail
```  
**Output:**  
```
google-chrome --new-window https://mail.google.com/mail/u/0/
```  


**Input:**  
```
google -s let me google that for you -n what I was actually working on
```  
**Output:**  
```
google-chrome google.ca/search?q=let me google that for you
google-chrome --new-window google.ca/search?q=what I was actually working on
```  

*Note here* that `-s` must be passed to the first search, as without it the results would be:  
```
google-chrome google.ca/search?q=let me google that for you -n what I was actually working on
```  


**Input:**  
```
google -oob --option-one --option-two thestack -nb gmail
```  
**Output:**  
```
google-chrome --option-one --option-two https://stackoverflow.com/
google-chrome --new-window https://mail.google.com/mail/u/0/
```  
Note that this is equivalent to `google -ob '--option-one --option-two' thestack -nb gmail`  


**Input:**  
```
google -o --option-one -o --option-two -b gmail -n how to write bash scripts
```  
**Output:**  
```
google-chrome --option-one --option-two https://mail.google.com/mail/u/0/
google-chrome --new-window google.ca/search?q=how to write bash scripts
```  


**Input:**  
```
google -ns search for gmail -oob --option-one --option-two gmail
```  
**Output:**  
```
google-chrome --new-window google.ca/search?q=search for gmail
google-chrome --option-one --option-two https://mail.google.com/mail/u/0/
```  


**Input:**  
```
google -ns "how to javascript -jquery" -b devblog
```  
**Output:**  
```
google-chrome --new-window google.ca/search?q=how to javascript -jquery
google-chrome https://dev.to/
```  


**Input:**  
```
google -ns "how to css -bootstrap" -b devblog
```  
**Output:**  
```
google-chrome --new-window google.ca/search?q=how to css -bootstrap
google-chrome https://dev.to/
```  

*Note here* that the quotes are necessary since `-bootstrap` would otherwise pe parsed as an option (as it starts with `b`):  
`Could not find bookmark ''`  


**Input:**  
```
google -B vivaldi -nb gmail -s this is a test
```  
**Output:**  
```
vivaldi --new-window https://mail.google.com/mail/u/0/
vivaldi google.ca/search?q=this is a test
```  

*Note here* The browser option applies once to the entire command - you cannot run 2 browsers from one command, you must call the script twice.  
The above is equivalent to `google -nb gmail -s this is a test -B vivaldi`  


**Input:**  
```
google -c -b myapi
```  
**Output:**  
```
curl https://myapp.com/api/
```  


**Input:**  
```
google -c -o "-XPOST -H 'Content-Type: application/json' -d '{\"username\":\"pat\"}'" -b myapi
```  
**Output:**  
```
curl -XPOST -H 'Content-Type: application/json' -d '{"username":"pat"}' https://myapp.com/api/
```  
At this point it makes more sense to use curl on it's own, but you get the point.  


**Input:**  
```
google -f ./index.html
```  
**Output:**  
```
google-chrome ./index.html
```  


**Input:**  
```
google -w http://localhost:8000
```  
**Output:**  
```
google-chrome http://localhost:8000
```  


**Input:**  
```
google -w stackoverflow.com
```  
**Output:**  
```
google-chrome stackoverflow.com
```  


**Input:**  
```
google -nl test -s this is a search
```
**Output:**  
```
google-chrome --new-window google.ca/search?btnI=1&q=test
google-chrome google.ca/search?q=this is a search
```


**Input:**  
```
google -ln test -s this is a search
```
**Output:**  
```
google-chrome google.ca/search?btnI=1&q=test
google-chrome --new-window google.ca/search?q=this is a search
```

*Note here* As mentioned above - this is the reason why options must preceed modes.  
The above is the same as if you ran: `google -l test -n -s this is a search`  
