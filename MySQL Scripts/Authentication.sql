DELIMITER //
DROP PROCEDURE IF EXISTS doesUserExist//
CREATE PROCEDURE doesUserExist (IN email_addr VARCHAR(255))
BEGIN
	SELECT id FROM users WHERE email=email_addr;
END//
DELIMITER ;
DELIMITER //
DROP PROCEDURE IF EXISTS login//
CREATE PROCEDURE login (IN user_id INT, IN pwrd VARCHAR(20))
BEGIN
	SELECT id, firstname, `admin`, lastname FROM users WHERE id=user_id AND password=AES_ENCRYPT(pwrd, salt);
END//
DELIMITER ;
DELIMITER //
DROP PROCEDURE IF EXISTS register//
CREATE PROCEDURE register (IN firstnm VARCHAR(10), IN lastnm VARCHAR(10), IN email_addr VARCHAR(255), IN pwrd VARCHAR(20))
BEGIN
	INSERT INTO users (firstname, lastname, email) VALUES (firstnm, lastnm, email_addr);
    SET SQL_SAFE_UPDATES=0;
    UPDATE users SET salt=SHA(id) WHERE email=email_addr;
    UPDATE users SET password=AES_ENCRYPT(pwrd, salt) WHERE email=email_addr;
    SELECT id FROM users WHERE email=email_addr;
END//
DELIMITER ;
DELIMITER //
DROP PROCEDURE IF EXISTS registerJob//
CREATE PROCEDURE registerJob (	IN user_id INT,
								IN is_sing_leader BOOLEAN,
								IN is_singer BOOLEAN,
                                IN is_guitarist BOOLEAN,
                                IN is_bass_guitarist BOOLEAN,
                                IN is_pianist BOOLEAN,
                                IN is_drummer BOOLEAN,
                                IN is_elec_guitarist BOOLEAN,
                                IN is_sound BOOLEAN,
                                IN is_beamer BOOLEAN)
BEGIN
	UPDATE users SET sing_leader=is_sing_leader, singer=is_singer, guitarist=is_guitarist, bass_guitarist=is_bass_guitarist, pianist=is_pianist, drummer=is_drummer, elec_guitarist=is_elec_guitarist, sound=is_sound, beamer=is_beamer WHERE id=user_id;
END//
DELIMITER ;
DELIMITER //
DROP TRIGGER authenticationTrigger;
CREATE TRIGGER authenticationTrigger BEFORE INSERT ON authentication
FOR EACH ROW BEGIN
	SET NEW.authenticate_key=lpad(conv(floor(rand()*pow(36,8)), 10, 36), 8, 0);
END//
DELIMITER ;
DELIMITER //
DROP PROCEDURE delete_user;
CREATE PROCEDURE delete_user(IN user_id INT)
BEGIN
	SET SQL_SAFE_UPDATES=0;
	UPDATE dates
    SET singers = JSON_REMOVE(
		singers, replace(json_search(singers, 'one', user_id), '"', '')
    )
    WHERE json_search(singers, 'one', user_id) IS NOT NULL;
    UPDATE dates
    SET sing_leaders = JSON_REMOVE(
		sing_leaders, replace(json_search(sing_leaders, 'one', user_id), '"', '')
    )
    WHERE json_search(sing_leaders, 'one', user_id) IS NOT NULL;
    UPDATE dates
    SET guitarists = JSON_REMOVE(
		guitarists, replace(json_search(guitarists, 'one', user_id), '"', '')
    )
    WHERE json_search(guitarists, 'one', user_id) IS NOT NULL;
    UPDATE dates
    SET bass_guitarists = JSON_REMOVE(
		bass_guitarists, replace(json_search(bass_guitarists, 'one', user_id), '"', '')
    )
    WHERE json_search(bass_guitarists, 'one', user_id) IS NOT NULL;
    UPDATE dates
    SET pianists = JSON_REMOVE(
		pianists, replace(json_search(pianists, 'one', user_id), '"', '')
    )
    WHERE json_search(pianists, 'one', user_id) IS NOT NULL;
    UPDATE dates
    SET drummers = JSON_REMOVE(
		drummers, replace(json_search(drummers, 'one', user_id), '"', '')
    )
    WHERE json_search(drummers, 'one', user_id) IS NOT NULL;
    UPDATE dates
    SET elec_guitarists = JSON_REMOVE(
		elec_guitarists, replace(json_search(elec_guitarists, 'one', user_id), '"', '')
    )
    WHERE json_search(elec_guitarists, 'one', user_id) IS NOT NULL;
    UPDATE dates
    SET sounds = JSON_REMOVE(
		sounds, replace(json_search(sounds, 'one', user_id), '"', '')
    )
    WHERE json_search(sounds, 'one', user_id) IS NOT NULL;
    UPDATE dates
    SET beamers = JSON_REMOVE(
		beamers, replace(json_search(beamers, 'one', user_id), '"', '')
    )
    WHERE json_search(beamers, 'one', user_id) IS NOT NULL;
    DELETE FROM users WHERE id=user_id;
END //
DELIMITER ;