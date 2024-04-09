let bst; // Binary Search Tree object
let playAnimation = false;
let animationQueue = [];
let currentStep = 0;
let animationSpeed = 200; // Change animation speed as per requirement

function setup() {
    let canvas = createCanvas(windowWidth * 0.8, windowHeight); // Create canvas
    canvas.parent('right-panel'); // Set canvas parent to right-panel div
    bst = new BinarySearchTree(); // Initialize Binary Search Tree

    // Add event listeners to buttons
    document.getElementById('create-tree-btn').addEventListener('click', createTree);
    document.getElementById('insert-node-btn').addEventListener('click', insertNode);
    document.getElementById('delete-node-btn').addEventListener('click', deleteNode);
    document.getElementById('search-node-btn').addEventListener('click', searchNode);
    document.getElementById('balance-tree-btn').addEventListener('click', balanceTree);
    document.getElementById('play-btn').addEventListener('click', playAnimationFunc);
    document.getElementById('pause-btn').addEventListener('click', pauseAnimation);
    document.getElementById('reverse-btn').addEventListener('click', reverseAnimation);
}

function draw() {
    background(255); // Clear background
    bst.display(); // Display Binary Search Tree
    
    if (playAnimation && animationQueue.length > 0 && frameCount % animationSpeed === 0) {
        animationQueue[currentStep](); // Execute animation step
        currentStep++;
        if (currentStep === animationQueue.length) {
            playAnimation = false; // Stop animation when all steps are executed
        }
    }
}


// Node class representing a node in the binary search tree
// Define the Node class
class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
        this.isHighlighted = false; // Add a property to track if the node is highlighted
    }

    // Method to display node and its children
    display(x, y, xOffset) {
        // Display current node
        stroke(0);
        if (this.isHighlighted) {
            if (this.isFound) {
                fill(0, 255, 0); // Highlighted color (green) if the node is found
            } else {
                fill(255, 255, 0); // Highlighted color (yellow) if the node is not found
            }
        } else {
            fill(255); // Default color (white)
        }
        ellipse(x, y, 40, 40);
        textAlign(CENTER, CENTER);
        fill(0);
        text(this.data, x, y);

        // Display left child
        if (this.left !== null) {
            line(x, y + 20, x - xOffset, y + 80);
            this.left.display(x - xOffset, y + 80, xOffset / 2);
        }

        // Display right child
        if (this.right !== null) {
            line(x, y + 20, x + xOffset, y + 80);
            this.right.display(x + xOffset, y + 80, xOffset / 2);
        }
    }

    // Method to highlight or unhighlight the node
    highlight(status, isFound = false) {
        this.isHighlighted = status;
        this.isFound = isFound; // Set the found status
    }

    adjustSpacing(x, y) {
        // No need for xOffset here, adjust spacing based on x position only
        this.display(x, y, width / 4);
    }

    static resetColors(node) {
        if (node !== null) {
            node.isHighlighted = false;
            Node.resetColors(node.left);
            Node.resetColors(node.right);
        }
    }
    animateInsertion(finalX, finalY, duration) {
        let frames = duration / 1000 * frameRate(); // Total frames to complete animation
        let deltaX = (finalX - this.x) / frames; // Change in x-coordinate per frame
        let deltaY = (finalY - this.y) / frames; // Change in y-coordinate per frame
        let currentFrame = 0; // Current frame count
        
        // Animate the movement of the new node
        let animationInterval = setInterval(() => {
            // Update current position
            this.x += deltaX;
            this.y += deltaY;
            currentFrame++;
            // End animation when the final position is reached
            if (currentFrame >= frames) {
                clearInterval(animationInterval);
                // Update the final position to ensure accuracy
                this.x = finalX;
                this.y = finalY;
            }
        }, 1000 / frameRate());
    }
}

// Define the BinarySearchTree class
class BinarySearchTree {
    constructor() {
        this.root = null; // Root of the tree
    }

    // Method to display the tree
    display() {
        if (this.root !== null) {
            this.root.display(width / 2, 50, width / 4);
        }
    }
    
    
    resetColors() {
        Node.resetColors(this.root);
    }

    // Method to insert a new node into the binary search tree
    insert(data) {
        if (this.search(data)) {
            alert("Duplicate value. Node not inserted.");
            return;
        }
        let newNode = new Node(data); // Create a new node
        if (this.root === null) {
            this.root = newNode; // If the tree is empty, set the new node as the root
        } else {
            this.insertNode(this.root, newNode); // Otherwise, call the helper function to insert the node
        }
    }

    // Method to search for a value in the tree
    search(value) {
        return this.searchNode(this.root, value);
    }

    // Helper function to recursively search for a value in the binary search tree
    searchNode(node, value) {
        if (node === null) {
            return false; // Value not found
        }
        if (value === node.data) {
            return true; // Value found
        }
        if (value < node.data) {
            return this.searchNode(node.left, value); // Search left subtree
        }
        return this.searchNode(node.right, value); // Search right subtree
    }

    // Method to helper function to recursively insert a new node into the binary search tree
    insertNode(node, newNode) {
        if (newNode.data < node.data) {
            if (node.left === null) {
                node.left = newNode; // Insert as left child if left child is null
                animationQueue.push(() => node.left.animateInsertion(width / 2 - width / 4, height / 10, width / 4));
            } else {
                this.insertNode(node.left, newNode); // Otherwise, recursively insert into left subtree
            }
        } else {
            if (node.right === null) {
                node.right = newNode; // Insert as right child if right child is null
                animationQueue.push(() => node.right.animateInsertion(width / 2 + width / 4, height / 10, width / 4));
            } else {
                this.insertNode(node.right, newNode); // Otherwise, recursively insert into right subtree
            }
        }

    

    }

    ///balancing binary tree

    balance() {
        bst.resetColors();
        if (this.root) {
            let nodes = [];
            this.inOrderTraversal(this.root, node => nodes.push(node));
            nodes.sort((a, b) => a.data - b.data); // Sort the nodes based on their values
            this.root = this.constructBalancedBinarySearchTree(nodes); // Construct a balanced binary search tree
            this.root.adjustSpacing(width / 2, 50); // Adjust node positions after conversion
        }
    }

    // In-order traversal of the tree
    inOrderTraversal(node, callback) {
        if (node) {
            this.inOrderTraversal(node.left, callback);
            callback(node);
            this.inOrderTraversal(node.right, callback);
        }
    }

    // Construct a balanced binary search tree from sorted nodes
    constructBalancedBinarySearchTree(nodes) {
        if (nodes.length === 0) {
            return null;
        }
        const mid = Math.floor(nodes.length / 2);
        const node = nodes[mid];
        node.left = this.constructBalancedBinarySearchTree(nodes.slice(0, mid)); 
        node.right = this.constructBalancedBinarySearchTree(nodes.slice(mid + 1)); 
        return node;
    }

    // Method to find a node with a specific value in the tree
    findNodeWithValue(node, value) {
        if (node === null || node.data === value) {
            return node;
        }
        if (value < node.data) {
            return this.findNodeWithValue(node.left, value);
        }
        return this.findNodeWithValue(node.right, value);
    }
}

function balanceTree() {
   
    bst.balance();
   
}
// Function to insert a node into the tree
function insertNode() {
    let data = prompt('Enter the value to insert:');
    if (data !== null && data.trim() !== '') {
        let value = parseInt(data);
        bst.insert(value);
        valuesArray.push(value);
        console.log("User-provided values:", valuesArray); // Store the inserted value in the array
    }

}
// Function to remove a value from the valuesArray
function removeFromValuesArray(value) {
    const index = valuesArray.indexOf(value);
    if (index !== -1) {
        valuesArray.splice(index, 1);
    }
}



function deleteNode() {
    console.log("User-updated values:", valuesArray);
    bst.balance();
    let input = prompt('Enter the values of the nodes to delete (separated by comma):');
    if (input !== null && input.trim() !== '') {
        let values = input.split(',').map(value => parseInt(value.trim()));
        if (values.length !== 2 || isNaN(values[0]) || isNaN(values[1])) {
            alert('Please enter two valid integer values separated by comma.');
            return;
        }
        let node1 = bst.findNodeWithValue(bst.root, values[0]);
        let node2 = bst.findNodeWithValue(bst.root, values[1]);
        if (node1 === null || node2 === null) {
            alert('One or both of the nodes are not found in the tree. Enter correct or present values.');
            return;
        }
        playAnimation = true;
        animationQueue = [];
        currentStep = 0;
        animationQueue.push(() => highlightNodeInTree(node1.data, 'orange'));
        animationQueue.push(() => bst.deleteNodeWithValue(node1.data));
        animationQueue.push(() => {
            removeFromValuesArray(node1.data); // Remove from valuesArray if found
            bst.resetColors();
        });
        animationQueue.push(() => highlightNodeInTree(node2.data, 'orange'));
        animationQueue.push(() => bst.deleteNodeWithValue(node2.data));
        animationQueue.push(() => {
            removeFromValuesArray(node2.data); // Remove from valuesArray if found
            bst.resetColors();

        });
    }
    
}

// Method to delete a node with a specific value from the tree
BinarySearchTree.prototype.deleteNodeWithValue = function(value) {
    this.root = this.deleteNodeRecursively(this.root, value);
};

// Helper function to recursively delete a node with a specific value from the tree
BinarySearchTree.prototype.deleteNodeRecursively = function(node, value) {
    if (node === null) {
        return null;
    }
    if (value < node.data) {
        node.left = this.deleteNodeRecursively(node.left, value);
    } else if (value > node.data) {
        node.right = this.deleteNodeRecursively(node.right, value);
    } else {
        // Node to delete found
        if (node.left === null && node.right === null) {
            // Case 1: Node has no children
            return null;
        } else if (node.left === null) {
            // Case 2: Node has one child (right)
            return node.right;
        } else if (node.right === null) {
            // Case 2: Node has one child (left)
            return node.left;
        } else {
            // Case 3: Node has two children
            // Find the minimum node in the right subtree (or maximum node in the left subtree)
            let minRightNode = this.findMinNode(node.right);
            // Copy the data from the minimum node to the current node
            node.data = minRightNode.data;
            // Delete the minimum node in the right subtree
            node.right = this.deleteNodeRecursively(node.right, minRightNode.data);
        }
    }
    return node;
};

// Function to find the minimum node in a subtree (leftmost node)
BinarySearchTree.prototype.findMinNode = function(node) {
    while (node.left !== null) {
        node = node.left;
    }
    return node;
};



// Function to search for a node in the tree
function searchNode() {
    bst.resetColors();
    let data = prompt('Enter the value to search:');
    if (data !== null && data.trim() !== '') {
        let value = parseInt(data);
        let found = bst.search(value);
        if (found) {
            highlightNodeInTree(value);
        } else {
            alert("Element not found in the tree.");
        }
    }

}

// Function to highlight the node in the tree
function highlightNodeInTree(value) {
    highlightNodeRecursive(bst.root, value);
}

function highlightNodeRecursive(node, targetValue) {
    if (node !== null) {
        // Highlight the current node
        node.highlight(true, node.data === targetValue); // Pass true if it's the target node
        setTimeout(() => node.highlight(false), 100000); // Unhighlight after 1 second

        // If the current node is the target node, stop traversing further
        if (node.data === targetValue) {
            return;
        }

        // Traverse left subtree if the target value is less than the current node's value
        if (targetValue < node.data) {
            setTimeout(() => highlightNodeRecursive(node.left, targetValue), 1000);
        } else { // Otherwise, traverse right subtree
            setTimeout(() => highlightNodeRecursive(node.right, targetValue), 1000);
        }
    }
}

function rotateRight(node) {
    let oldLeft = node.left;
    node.left = oldLeft.right;
    oldLeft.right = node;
    return oldLeft;
}

// Function to perform a left rotation on the given node
function rotateLeft(node) {
    let oldRight = node.right;
    node.right = oldRight.left;
    oldRight.left = node;
    return oldRight;
}

// Function to perform a right-left rotation (double rotation) on the given node
function rotateRightLeft(node) {
    node.right = rotateRight(node.right);
    return rotateLeft(node);
}

// Function to perform a left-right rotation (double rotation) on the given node
function rotateLeftRight(node) {
    node.left = rotateLeft(node.left);
    return rotateRight(node);
}

// Function to balance the tree
function balanceTree() {
    bst.balance();
}

// Function to play animation
function playAnimationFunc() {
    playAnimation = true;
}

// Function to pause animation
function pauseAnimation() {
    playAnimation = false;
}

// Function to reverse animation
function reverseAnimation() {
    animationQueue.reverse();
    currentStep = 0;
}

// Function to create a new tree with user-provided or random values
function createTree() {
    let userInput = confirm("Do you want to provide values for the tree yourself?");
    if (userInput) {
        let inputValues = prompt("Enter up to 16 integer values separated by commas:");
        if (inputValues) {
            let values = inputValues.split(",").map(value => parseInt(value.trim()));
            if (validateValues(values)) {
                valuesArray = values.slice(0, 36); // Store up to 16 values
                console.log("User-provided values:", valuesArray);
                createTreeWithAnimation(valuesArray);
            } else
            {
                alert("Invalid input. Please enter valid integer values.");
            }
        }
    } else {
        // Generate random values
        let randomValues = Array.from({ length: 15 }, () => Math.floor(Math.random() * 100) + 1);
        valuesArray = randomValues;
        console.log("Randomly generated values:", valuesArray);
        createTreeWithAnimation(randomValues);
    }
}

// Function to validate user-provided values
function validateValues(values) {
    if (!Array.isArray(values)) return false;
    if (values.length > 15) return false;
    for (let value of values) {
        if (isNaN(value) || !Number.isInteger(value)) return false;
    }
    return true;
}

// Function to create tree with animation
function createTreeWithAnimation(values) {
    bst = new BinarySearchTree(); // Initialize Binary Search Tree
    let index = 0;
    let insertNextNode = () => {
        if (index < values.length) {
            bst.insert(values[index]);
            index++;
            setTimeout(insertNextNode, 100); // Adjust animation speed here (milliseconds)
        }
    };
    insertNextNode();
}
