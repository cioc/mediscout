DROP TABLE IF EXISTS hospitals;

CREATE TABLE hospitals (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                        fed_id INT NOT NULL, 
                        name VARCHAR(200) NOT NULL,
                        fed_name VARCHAR(200) NOT NULL,
                        lat DOUBLE NOT NULL,
                        lng DOUBLE NOT NULL,
                        neighborhood VARCHAR(100) NULL,
                        addr VARCHAR(100) NOT NULL,
                        city VARCHAR(100) NOT NULL,
                        state VARCHAR(2) NOT NULL,
                        zip VARCHAR(5) NOT NULL) ENGINE=MyISAM;

ALTER TABLE hospitals ADD FULLTEXT(name, fed_name);

DROP TABLE IF EXISTS procedures;

CREATE TABLE procedures (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                         fed_proc_id VARCHAR(5) NOT NULL,
                         proc_type VARCHAR(20) NOT NULL,
                         name VARCHAR(200) NOT NULL,
                         options VARCHAR(100) NULL,
                         description TEXT NULL,
                         elective VARCHAR(10) NULL) ENGINE=MyISAM;

ALTER TABLE procedures ADD FULLTEXT(name, description);

DROP TABLE IF EXISTS costs;

CREATE TABLE costs (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    fed_id INT NOT NULL,
                    fed_proc_id VARCHAR(5) NOT NULL,
                    billed DOUBLE NOT NULL,
                    paid DOUBLE NOT NULL);

