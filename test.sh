expect() {
    echo "expect:"
    args=("$@")
    for ((i = 0; i < ${#args[@]}; i++)); do
        echo "  google-chrome ${args[$i]}"
    done
}
runnable="./google -oob '--option-one' '--option-two' mail -nb gmail"
echo $runnable
expect "--option-one --option-two bookmarkmail" "--new-window bookmarkgmail"
echo Result:
$runnable
echo

runnable="./google -oob '--option-one' '--option-two' mail -n -b gmail"
echo $runnable
expect "--option-one --option-two bookmarkmail" "--new-window bookmarkgmail"
echo Result:
$runnable
echo

runnable="./google -n -b gmail"
echo $runnable
expect "--new-window bookmarkgmail"
echo Result:
$runnable
echo
