

// fuzzy search lookup via decomposition of characters in a word
// provides constant time lookup

class Node {
    constructor (characters) {
        this.leaves = {}
        this.string = characters;

        this.constructLeaves();
    }

    constructLeaves () {
        // create a character tree
        this.string.split('').forEach((char, i) => {
            let nextSubstrsForChar = this.string.slice(i+1);
            if (!this.leaves.hasOwnProperty(char)) {
                this.leaves[char] = new Node(nextSubstrsForChar);
            }
        });
    }

    lookupChar(char) {
        // returns list of subnodes that contains the character
        if (this.leaves.hasOwnProperty(char)) {
            return true;
        }
        return false;
    }

    search(query) {
        // does this node or its subnodes contain the query?
        let [firstChar, rest] = [query[0], query.slice(1)]
        if (rest.length === 0) {
            return this.lookupChar(firstChar);
        } else if (this.lookupChar(firstChar)) {
            return this.leaves[firstChar].search(rest);
        } else {
            return false;
        }
    }

}

module.exports = Node;


