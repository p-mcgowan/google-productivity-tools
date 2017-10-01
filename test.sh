echo "./google -oob '--option-one' '--option-two' mail -nb gmail"
echo "shoudlnt say: Could not find bookmark ''"
./google -oob '--option-one' '--option-two' mail -nb gmail

echo "./google -oob '--option-one' '--option-two' mail -n -b gmail"
echo "doesnt screw up finding bookmark"
./google -oob '--option-one' '--option-two' mail -n -b gmail
