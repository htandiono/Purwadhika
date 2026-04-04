function generateRandomArray(n) {
    const arr = Array.from({ length: n }, (_, i) => i + 1);

    arr.sort(() => Math.random() - 0.5);

    return arr;
}

console.log("Random Array:", generateRandomArray(5));

class Tumbler {
    constructor(brand, capacity, color) {
        this.brand = brand;
        this.capacity = capacity; // in ml
        this.currentVolume = 0;   // starts empty
        this.color = color;
        this.isLidOpen = false;
    }

    openLid() {
        this.isLidOpen = true;
        console.log(`[Tumbler] The lid of the ${this.brand} tumbler is now open.`);
    }

    closeLid() {
        this.isLidOpen = false;
        console.log(`[Tumbler] The lid of the ${this.brand} tumbler is now closed.`);
    }

    fill(amount) {
        if (!this.isLidOpen) {
            console.log("[Tumbler] Cannot fill: The lid is closed!");
            return;
        }
        const newVolume = this.currentVolume + amount;
        if (newVolume > this.capacity) {
            this.currentVolume = this.capacity;
            console.log(`[Tumbler] Overfilled! Tumbler is now full at ${this.capacity}ml.`);
        } else {
            this.currentVolume = newVolume;
            console.log(`[Tumbler] Filled ${amount}ml. Current volume: ${this.currentVolume}ml.`);
        }
    }

    drink(amount) {
        if (!this.isLidOpen) {
            console.log("[Tumbler] Cannot drink: The lid is closed!");
            return;
        }
        if (this.currentVolume <= 0) {
            console.log("[Tumbler] The tumbler is empty!");
            return;
        }
        const actualDrunk = Math.min(this.currentVolume, amount);
        this.currentVolume -= actualDrunk;
        console.log(`[Tumbler] You drank ${actualDrunk}ml. Remaining: ${this.currentVolume}ml.`);
    }
}

class Fridge {
    constructor(brand, model) {
        this.brand = brand;
        this.model = model;
        this.temperature = 4; // default temperature in Celsius
        this.items = [];      // list of items inside
        this.isDoorOpen = false;
    }

    toggleDoor() {
        this.isDoorOpen = !this.isDoorOpen;
        console.log(`[Fridge] The fridge door is now ${this.isDoorOpen ? "open" : "closed"}.`);
    }

    setTemperature(temp) {
        this.temperature = temp;
        console.log(`[Fridge] Temperature set to ${this.temperature}°C.`);
    }

    addItem(item) {
        if (!this.isDoorOpen) {
            console.log("[Fridge] Cannot add item: The door is closed!");
            return;
        }
        this.items.push(item);
        console.log(`[Fridge] Added "${item}" to the fridge.`);
    }

    removeItem(item) {
        if (!this.isDoorOpen) {
            console.log("[Fridge] Cannot remove item: The door is closed!");
            return;
        }
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            console.log(`[Fridge] Removed "${item}" from the fridge.`);
        } else {
            console.log(`[Fridge] "${item}" not found in the fridge.`);
        }
    }
}

// --- Testing Tumbler ---
console.log("\n--- Testing Tumbler ---");
const myTumbler = new Tumbler("HydroFlask", 500, "Pacific Blue");
myTumbler.openLid();
myTumbler.fill(300);
myTumbler.closeLid();
myTumbler.drink(100); // Should fail: lid is closed
myTumbler.openLid();
myTumbler.drink(100);
console.log("Final Tumbler State:", myTumbler);

// --- Testing Fridge ---
console.log("\n--- Testing Fridge ---");
const myFridge = new Fridge("Samsung", "Family Hub");
myFridge.setTemperature(2);
myFridge.toggleDoor();
myFridge.addItem("Milk");
myFridge.addItem("Eggs");
myFridge.addItem("Apple");
myFridge.removeItem("Milk");
myFridge.toggleDoor();
console.log("Final Fridge State:", myFridge);

// --- Student and Classroom Task ---

class Student {
    constructor(id, name, age) {
        this.id = id;
        this.name = name;
        this.age = age;
    }
}

class Classroom {
    constructor(className) {
        this.className = className;
        this.students = [];
    }

    addStudent(student) {
        if (student instanceof Student) {
            this.students.push(student);
        } else {
            console.log("Error: Only Student instances can be added.");
        }
    }

    listStudents(sortBy = "id") {
        const validSortFields = ["id", "name", "age"];
        if (!validSortFields.includes(sortBy)) {
            console.log(`Error: Invalid sort field. Use ${validSortFields.join(", ")}.`);
            return;
        }

        // Clone the array to avoid mutating the original student list
        const sortedArray = [...this.students].sort((a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            }
            return a[sortBy] - b[sortBy];
        });

        console.log(`\n--- Students in ${this.className} (Sorted by ${sortBy}) ---`);
        console.log(sortedArray);
    }
}

// Generate 5 Students
const s1 = new Student(104, "Alice", 20);
const s2 = new Student(101, "Charlie", 22);
const s3 = new Student(105, "Bob", 19);
const s4 = new Student(102, "Eve", 21);
const s5 = new Student(103, "David", 23);

// Create Classroom and add students
const myClass = new Classroom("Web Development 101");
myClass.addStudent(s1);
myClass.addStudent(s2);
myClass.addStudent(s3);
myClass.addStudent(s4);
myClass.addStudent(s5);

// Demonstrate Sorting
myClass.listStudents("id");
myClass.listStudents("name");
myClass.listStudents("age");
