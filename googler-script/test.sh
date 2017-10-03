#!/bin/bash

result="$(google -d -M ./Bookmarks let me google that fore you)"
expected="\
google-chrome google.ca/search?q=let me google that fore you"
if [ "$result" == "$expected" ]; then
  echo Test passed
else
  echo Test failed
  echo Expected:
  echo "$expected"
  echo Got:
  echo "$result"
fi

result="$(google -d -M ./Bookmarks -l speedtest)"
expected="\
google-chrome google.ca/search?btnI=1&q=speedtest"
if [ "$result" == "$expected" ]; then
  echo Test passed
else
  echo Test failed
  echo Expected:
  echo "$expected"
  echo Got:
  echo "$result"
fi


result="$(google -d -M ./Bookmarks -b gmail)"
expected="\
google-chrome https://mail.google.com/mail/u/0/"
if [ "$result" == "$expected" ]; then
  echo Test passed
else
  echo Test failed
  echo Expected:
  echo "$expected"
  echo Got:
  echo "$result"
fi


result="$(google -d -M ./Bookmarks -nb gmail)"
expected="\
google-chrome --new-window https://mail.google.com/mail/u/0/"
if [ "$result" == "$expected" ]; then
  echo Test passed
else
  echo Test failed
  echo Expected:
  echo "$expected"
  echo Got:
  echo "$result"
fi


result="$(google -d -M ./Bookmarks -s let me google that fore you -n what I was actually working on)"
expected="\
google-chrome google.ca/search?q=let me google that fore you
google-chrome --new-window google.ca/search?q=what I was actually working on"
if [ "$result" == "$expected" ]; then
  echo Test passed
else
  echo Test failed
  echo Expected:
  echo "$expected"
  echo Got:
  echo "$result"
fi


result="$(google -d -M ./Bookmarks -oob --option-one --option-two thestack -nb gmail)"
expected="\
google-chrome --option-one --option-two https://stackoverflow.com/
google-chrome --new-window https://mail.google.com/mail/u/0/"
if [ "$result" == "$expected" ]; then
  echo Test passed
else
  echo Test failed
  echo Expected:
  echo "$expected"
  echo Got:
  echo "$result"
fi


result="$(google -d -M ./Bookmarks -o --option-one -o --option-two -b gmail -n how to write bash scripts)"
expected="\
google-chrome --option-one --option-two https://mail.google.com/mail/u/0/
google-chrome --new-window google.ca/search?q=how to write bash scripts"
if [ "$result" == "$expected" ]; then
  echo Test passed
else
  echo Test failed
  echo Expected:
  echo "$expected"
  echo Got:
  echo "$result"
fi


result="$(google -d -M ./Bookmarks -ns search fore gmail -oob --option-one --option-two gmail)"
expected="\
google-chrome --new-window google.ca/search?q=search fore gmail
google-chrome --option-one --option-two https://mail.google.com/mail/u/0/"
if [ "$result" == "$expected" ]; then
  echo Test passed
else
  echo Test failed
  echo Expected:
  echo "$expected"
  echo Got:
  echo "$result"
fi


result="$(google -d -M ./Bookmarks -ns "how to javascript -jquery" -b devblog)"
expected="\
google-chrome --new-window google.ca/search?q=how to javascript -jquery
google-chrome https://dev.to/"
if [ "$result" == "$expected" ]; then
  echo Test passed
else
  echo Test failed
  echo Expected:
  echo "$expected"
  echo Got:
  echo "$result"
fi


result="$(google -d -M ./Bookmarks -ns "how to css -bootstrap" -b devblog)"
expected="\
google-chrome --new-window google.ca/search?q=how to css -bootstrap
google-chrome https://dev.to/"
if [ "$result" == "$expected" ]; then
  echo Test passed
else
  echo Test failed
  echo Expected:
  echo "$expected"
  echo Got:
  echo "$result"
fi


result="$(google -d -M ./Bookmarks -B vivaldi -nb gmail -s this is a test)"
expected="\
vivaldi --new-window https://mail.google.com/mail/u/0/
vivaldi google.ca/search?q=this is a test"

result="$(google -d -M ./Bookmarks -nb gmail -s this is a test -B vivaldi)"
expected="\
vivaldi --new-window https://mail.google.com/mail/u/0/
vivaldi google.ca/search?q=this is a test"
if [ "$result" == "$expected" ]; then
  echo Test passed
else
  echo Test failed
  echo Expected:
  echo "$expected"
  echo Got:
  echo "$result"
fi


result="$(google -d -M ./Bookmarks -c -b myapi)"
expected="\
curl https://myapp.com/api/"
if [ "$result" == "$expected" ]; then
  echo Test passed
else
  echo Test failed
  echo Expected:
  echo "$expected"
  echo Got:
  echo "$result"
fi


result="$(google -d -M ./Bookmarks -c -o '-XPOST -H "Content-Type: application/json" -d "{"username":"pat"}"' -b myapi)"
expected="\
curl -XPOST -H \"Content-Type: application/json\" -d \"{\"username\":\"pat\"}\" https://myapp.com/api/"
if [ "$result" == "$expected" ]; then
  echo Test passed
else
  echo Test failed
  echo Expected:
  echo "$expected"
  echo Got:
  echo "$result"
fi


result="$(google -d -M ./Bookmarks -f ./index.html)"
expected="\
google-chrome ./index.html"
if [ "$result" == "$expected" ]; then
  echo Test passed
else
  echo Test failed
  echo Expected:
  echo "$expected"
  echo Got:
  echo "$result"
fi


result="$(google -d -M ./Bookmarks -w http://localhost:8000)"
expected="\
google-chrome http://localhost:8000"
if [ "$result" == "$expected" ]; then
  echo Test passed
else
  echo Test failed
  echo Expected:
  echo "$expected"
  echo Got:
  echo "$result"
fi


result="$(google -d -M ./Bookmarks -w stackoverflow.com)"
expected="\
google-chrome stackoverflow.com"
if [ "$result" == "$expected" ]; then
  echo Test passed
else
  echo Test failed
  echo Expected:
  echo "$expected"
  echo Got:
  echo "$result"
fi


result="$(google -d -M ./Bookmarks -nl test -s this is a search)"
expected="\
google-chrome --new-window google.ca/search?btnI=1&q=test
google-chrome google.ca/search?q=this is a search"
if [ "$result" == "$expected" ]; then
  echo Test passed
else
  echo Test failed
  echo Expected:
  echo "$expected"
  echo Got:
  echo "$result"
fi


result="$(google -d -M ./Bookmarks -ln test -s this is a search)"
expected="\
google-chrome google.ca/search?btnI=1&q=test
google-chrome --new-window google.ca/search?q=this is a search"
