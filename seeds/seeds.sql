INSERT INTO department (dept_name)
VALUES ("Team Salamanca"),
("Team Fring"),
("Team Pinkman"),
("Team Heisenberg"),
("Team Innocents"),
("Team DEA");

INSERT INTO role (title, salary, department_id)
VALUES 
-- 1
("Manager", 1500000, 1),
-- 2
("Specialist", 50000, 1),
-- 3
("Innocent", 0, 1),
-- 4
("Manager", 1500000, 2),
-- 5
("Specialist", 50000, 2),
-- 6
("Innocent", 0, 2),
-- 7
("Manager", 1500000, 3),
-- 8
("Specialist", 50000, 3),
-- 9
("Innocent", 0, 3),
-- 10
("Manager", 1500000, 4),
-- 11
("Specialist", 50000, 4),
-- 12
("Innocent", 0, 4),
-- 13
("Manager", 0, 5),
-- 14
("Specialist", 0, 5),
-- 15
("Innocent", 0, 5),
-- 16
("Manager", 1500000, 6),
-- 17
("Specialist", 50000, 6),
-- 18
("Innocent", 0, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Walter", "White", 10, null),
("Jesse", "Pinkman", 7, null),
("Gus", "Fring", 4, null),
("Hank", "Scrader", 16, null),
("Hector", "Salamanca", 1, null),
("Skyler", "White", 13, null),
("Saul", "Goodman", 11, 1),
("Mike", "Ehrmantraut", 5, 3),
("Tuco", "Salamanca", 2, 5),
("Maria", "Schrader", 14, 6),
("Skinny", "Pete", 8, 2),
("Steven", "Gomez", 17, 4),
("Gale", "Boetticher", 5, 3),
("Walter", "White Jr.", 14, 6),
("Ted", "Beneke", 14, 6),
("Tyrus", "Kitt", 5, 3),
("Krazy", "8", 2, 5),
("Badger", "Smith", 8, 2),
("Lalo", "Salamanca", 2, 5),
("Nacho", "Varga", 2, 5);