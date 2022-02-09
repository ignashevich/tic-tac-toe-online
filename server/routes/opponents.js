const NodeCache = require( "node-cache" );
var express = require('express');
var router = express.Router();

const cache = new NodeCache();

cache.set("opponents", []);
cache.set("pairs", {});

router.post('/find', function(req, res, next) {
    const {nickname, id} = req.body;
    if (id) {
        const opponents = cache.get("opponents");
        const pairs = cache.get("pairs");

        console.log({opponents, pairs, id, body: req.body});

        if (pairs[id]) {
            res.send({opponent: pairs[id]});
            delete pairs[id];
            cache.set("pairs", pairs);
            return;
        }

        if (!opponents.find((value) => value === id)) {
            opponents.push(id);
            cache.set("opponents", opponents)
        } else if (opponents.length > 1) {
            const opponents = cache.get("opponents");
            const first = opponents.splice(opponents.indexOf(id), 1)[0];
            const second = opponents.pop();
            cache.set("opponents", opponents);
            cache.set("pairs", { ...cache.get("pairs"), [first]:second, [second]: first })
        }
    }

    res.send({opponent: null});
});

module.exports = router;
