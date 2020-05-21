class Build {
    constructor(name, year) {
        this.name = name;
        this.year = year;
    }

    getName() {
        return this.name;
    }

    getYear() {
        return this.year;
    }

    getAge(year) {
        return year - this.year;
    }
};

class Park extends Build {
    constructor(name, year, numberOfTrees, area) {
        super(name, year);

        this.numberOfTrees = numberOfTrees;
        this.area = area;
    }

    getNumberOfTrees() {
        return this.numberOfTrees;
    }

    getArea() {
        return this.area;
    }

    calculateTreeDensity() {
        if (this.area <= 0) {
            return 0;
        }

        return this.numberOfTrees / this.area;
    }
};

class Street extends Build {
    constructor(name, year, length = null) {
        super(name, year);

        this.length = length;
    }

    getLength() {
        return this.length;
    }

    classify() {
        if (!this.length) {
            return 'normal';
        }
        
        switch(true) {
            case this.length < 1000: return 'tiny';
            case this.length < 2000: return 'small';
            case this.length < 3000: return 'normal';
            case this.length < 4000: return 'big';
            case this.length >= 4000: return 'huge';
            default: return 'normal';
        }
    }
}

class City {
    constructor(name) {
        this.name = name;

        this.streets = new Map();
        this.parks = new Map();        
    }

    addStreet(street) {
        this.streets.set(street.getName(), street);
    }

    addPark(park) {
        this.parks.set(park.getName(), park);
    }

    printParksReport(numberOfTreesLimit = 15) {
        const parksCount = this.parks.size;
        if (parksCount <= 0) {
            return ;
        }
        
        console.log('---------PARKS REPORT---------');

        const now = new Date();
        let sumParkAge = 0;
        this.parks.forEach(park => sumParkAge += park.getAge(now.getFullYear()));

        console.log(`Our ${parksCount} parks have an average age of ${sumParkAge / parksCount} years`);

        this.parks.forEach(park => console.log(`${park.getName()} has a tree density of ${park.calculateTreeDensity()} trees per square km`));

        Array.from(this.parks)
            .filter(([name, park]) => park.getNumberOfTrees() > numberOfTreesLimit)
            .forEach(([name, park]) => console.log(`${park.getName()} has more than ${numberOfTreesLimit} trees`));

    }

    printStreetsReport() {
        const streetsCount = this.streets.size;
        if (streetsCount <= 0) {
            return ;
        }
        
        console.log('---------STREETS REPORT---------');

        let totalLenght = 0;
        this.streets.forEach(street => totalLenght += street.getLength());
        const averageLength = totalLenght / streetsCount;

        console.log(`Our ${streetsCount} streets have a total length ${totalLenght} km, with an average of ${averageLength} km`);

        this.streets.forEach(street => console.log(`${street.getName()}, build in ${street.getYear()}, is a ${street.classify()} street`));
    }
}

const city = new City('Lukovany');
city.addPark(new Park('Adamkuv park', 2013, 35, 5));
city.addPark(new Park('Vasikuv park', 2015, 12, 2));
city.addPark(new Park('Mikulaskuv park', 2018, 10, 1));

city.addStreet(new Street('Adamkova ulice', 2013, 4500));
city.addStreet(new Street('Vasikova ulice', 2015, 3200));
city.addStreet(new Street('Mikulaskova ulice', 2018, 1100));
city.addStreet(new Street('Viktorcina ulice', 2019));

city.printParksReport()
city.printStreetsReport()