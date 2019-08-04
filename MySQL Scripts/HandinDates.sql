DELIMITER //
DROP PROCEDURE IF EXISTS handin_dates//
CREATE PROCEDURE handin_dates (IN dates JSON, IN user_id INT)
proc_label:BEGIN
	DECLARE i INT;
    DECLARE date_i VARCHAR(12);
    DECLARE date_b VARCHAR(5);
    
    DECLARE is_sing_leader TINYINT;
    DECLARE is_singer TINYINT;
    DECLARE is_guitarist TINYINT;
    DECLARE is_bass_guitarist TINYINT;
    DECLARE is_pianist TINYINT;
    DECLARE is_drummer TINYINT;
    DECLARE is_elec_guitarist TINYINT;
    DECLARE is_sound TINYINT;
    DECLARE is_beamer TINYINT;
    
    IF (EXISTS(SELECT 1 FROM users WHERE id = user_id) = 0) THEN
		LEAVE proc_label;
	END IF;
    
    SELECT sing_leader, singer, guitarist, bass_guitarist, pianist, drummer, elec_guitarist, sound, beamer
	FROM users WHERE id = user_id
	INTO is_sing_leader, is_singer, is_guitarist, is_bass_guitarist, is_pianist, is_drummer, is_elec_guitarist, is_sound, is_beamer;
    
    SET i = 0;
    WHILE i < JSON_LENGTH(dates) DO
		SET date_i = JSON_UNQUOTE(JSON_EXTRACT(dates, CONCAT('$[', i, '][0]')));
        SET date_b = JSON_UNQUOTE(JSON_EXTRACT(dates, CONCAT('$[', i, '][1]')));
        
        IF strcmp(date_b, 'true') = 0 AND EXISTS(SELECT 1 FROM dates WHERE date = date_i) THEN
			IF is_sing_leader THEN CALL add_sing_leader(date_i, user_id); END IF;
			IF is_singer THEN CALL add_singer(date_i, user_id); END IF;
			IF is_guitarist THEN CALL add_guitarist(date_i, user_id); END IF;
			IF is_bass_guitarist THEN CALL add_bass_guitarist(date_i, user_id); END IF;
			IF is_pianist THEN CALL add_pianist(date_i, user_id); END IF;
			IF is_drummer THEN CALL add_drummer(date_i, user_id); END IF;
			IF is_elec_guitarist THEN CALL add_elec_guitarist(date_i, user_id); END IF;
			IF is_sound THEN CALL add_sound(date_i, user_id); END IF;
			IF is_beamer THEN CALL add_beamer(date_i, user_id); END IF;
		ELSEIF EXISTS(SELECT 1 FROM dates WHERE date = date_i) THEN
			IF is_sing_leader THEN CALL remove_sing_leader(date_i, user_id); END IF;
			IF is_singer THEN CALL remove_singer(date_i, user_id); END IF;
			IF is_guitarist THEN CALL remove_guitarist(date_i, user_id); END IF;
			IF is_bass_guitarist THEN CALL remove_bass_guitarist(date_i, user_id); END IF;
			IF is_pianist THEN CALL remove_pianist(date_i, user_id); END IF;
			IF is_drummer THEN CALL remove_drummer(date_i, user_id); END IF;
			IF is_elec_guitarist THEN CALL remove_elec_guitarist(date_i, user_id); END IF;
			IF is_sound THEN CALL remove_sound(date_i, user_id); END IF;
			IF is_beamer THEN CALL remove_beamer(date_i, user_id); END IF;
        END IF;
        
		SET i = i + 1;
    END WHILE;
    
    UPDATE users SET filled = 1 WHERE id = user_id;
END //
DELIMITER ;