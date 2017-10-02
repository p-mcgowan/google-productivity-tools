expect() {
  COMMAND="$1"
  echo -e "Command:\n  $COMMAND"
  shift
  echo "Expect:"
  args=("$@")
  for ((i = 0; i < ${#args[@]}; i++)); do
      echo "  google-chrome ${args[$i]}"
  done

  echo Result:
  $COMMAND |while read line; do echo '  '$line; done
  echo -e '\n\n'
}


# # "./google -oob --option-one --option-two mail -nb gmail"
# #
# # "--option-one --option-two https://webmail.shaw.ca/uwc/auth"
# # "--new-window https://mail.google.com/mail/u/0/"
# COMMAND="./google -oob --option-one --option-two mail -nb gmail"
# expect "$COMMAND" "--option-one --option-two https://webmail.shaw.ca/uwc/auth" "--new-window https://mail.google.com/mail/u/0/"

# # "./google -oob --option-one --option-two mail -n -b gmail"
# #
# # "--option-one --option-two https://webmail.shaw.ca/uwc/auth"
# # "--new-window https://mail.google.com/mail/u/0/"
# COMMAND="./google -oob --option-one --option-two mail -n -b gmail"
# expect "$COMMAND" "--option-one --option-two https://webmail.shaw.ca/uwc/auth" "--new-window https://mail.google.com/mail/u/0/"

# # "./google -oob --option-one --option-two mail"
# #
# # "--option-one --option-two https://webmail.shaw.ca/uwc/auth"
# COMMAND="./google -oob --option-one --option-two mail"
# expect "$COMMAND" "--option-one --option-two https://webmail.shaw.ca/uwc/auth"

# # "./google -n -b gmail"
# #
# # "--new-window https://mail.google.com/mail/u/0/"
# COMMAND="./google -n -b gmail"
# expect "$COMMAND" "--new-window https://mail.google.com/mail/u/0/"

# # "./google -nb gmail"
# #
# # "--new-window https://mail.google.com/mail/u/0/"
# COMMAND="./google -nb gmail"
# expect "$COMMAND" "--new-window https://mail.google.com/mail/u/0/"

# # "./google -oob --option-one --option-two mail -n search for gmail"
# #
# # "--option-one --option-two https://webmail.shaw.ca/uwc/auth"
# # "--new-window google.ca?q=search for gmail"
# COMMAND="./google -oob --option-one --option-two mail -n search for gmail"
# expect "$COMMAND" "--option-one --option-two https://webmail.shaw.ca/uwc/auth" "--new-window google.ca?q=search for gmail"

# "./google -n search for gmail -oob --option-one --option-two mail"
#
# "--new-window google.ca?q=search for gmail"
# "--option-one --option-two https://webmail.shaw.ca/uwc/auth"
COMMAND="./google -ns search for gmail -oob --option-one --option-two mail"
expect "$COMMAND" "--new-window google.ca?q=search for gmail" "--option-one --option-two https://webmail.shaw.ca/uwc/auth"

# "./google -n search for gmail -oob --option-one --option-two mail"
#
# "--new-window google.ca?q=search for gmail"
# "--option-one --option-two https://webmail.shaw.ca/uwc/auth"
COMMAND="./google -ns 'search for gmail -oob' -oob --option-one --option-two mail"
expect "$COMMAND" "--new-window google.ca?q=search for gmail -oob" "--option-one --option-two https://webmail.shaw.ca/uwc/auth"
