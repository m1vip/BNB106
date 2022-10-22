export function formatAddress(address) {
    if (address == "" || address == null || address.trim == "") return "";
    return address.slice(0, 4) + "..." + address.slice(-4);
}

export function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
       var pair = vars[i].split("=");
       if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
 };