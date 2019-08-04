DELIMITER //
DROP PROCEDURE add_singer;
CREATE PROCEDURE add_singer (IN d VARCHAR(10), IN id INT)
BEGIN
	SELECT singers FROM dates WHERE date = d INTO @j;
    SET @i = IF(JSON_SEARCH(@j, 'all', id) is not null, '[]', CONCAT('"', id, '"'));
    SELECT JSON_MERGE_PRESERVE(@j,@i) INTO @j;
    UPDATE dates SET singers = @j WHERE date = d;
END //
DELIMITER ;
DELIMITER //
DROP PROCEDURE add_sing_leader;
CREATE PROCEDURE add_sing_leader (IN d VARCHAR(10), IN id INT)
BEGIN
	SELECT sing_leaders FROM dates WHERE date = d INTO @j;
    SET @i = IF(JSON_SEARCH(@j, 'all', id) is not null, '[]', CONCAT('"', id, '"'));
    SELECT JSON_MERGE_PRESERVE(@j,@i) INTO @j;
    UPDATE dates SET sing_leaders = @j WHERE date = d;
END //
DELIMITER ;
DELIMITER //
DROP PROCEDURE add_guitarist;
CREATE PROCEDURE add_guitarist (IN d VARCHAR(10), IN id INT)
BEGIN
	SELECT guitarists FROM dates WHERE date = d INTO @j;
    SET @i = IF(JSON_SEARCH(@j, 'all', id) is not null, '[]', CONCAT('"', id, '"'));
    SELECT JSON_MERGE_PRESERVE(@j,@i) INTO @j;
    UPDATE dates SET guitarists = @j WHERE date = d;
END //
DELIMITER ;
DELIMITER //
DROP PROCEDURE add_bass_guitarist;
CREATE PROCEDURE add_bass_guitarist (IN d VARCHAR(10), IN id INT)
BEGIN
	SELECT bass_guitarists FROM dates WHERE date = d INTO @j;
    SET @i = IF(JSON_SEARCH(@j, 'all', id) is not null, '[]', CONCAT('"', id, '"'));
    SELECT JSON_MERGE_PRESERVE(@j,@i) INTO @j;
    UPDATE dates SET bass_guitarists = @j WHERE date = d;
END //
DELIMITER ;
DELIMITER //
DROP PROCEDURE add_pianist;
CREATE PROCEDURE add_pianist (IN d VARCHAR(10), IN id INT)
BEGIN
	SELECT pianists FROM dates WHERE date = d INTO @j;
    SET @i = IF(JSON_SEARCH(@j, 'all', id) is not null, '[]', CONCAT('"', id, '"'));
    SELECT JSON_MERGE_PRESERVE(@j,@i) INTO @j;
    UPDATE dates SET pianists = @j WHERE date = d;
END //
DELIMITER ;
DELIMITER //
DROP PROCEDURE add_drummer;
CREATE PROCEDURE add_drummer (IN d VARCHAR(10), IN id INT)
BEGIN
	SELECT drummers FROM dates WHERE date = d INTO @j;
    SET @i = IF(JSON_SEARCH(@j, 'all', id) is not null, '[]', CONCAT('"', id, '"'));
    SELECT JSON_MERGE_PRESERVE(@j,@i) INTO @j;
    UPDATE dates SET drummers = @j WHERE date = d;
END //
DELIMITER ;
DELIMITER //
DROP PROCEDURE add_elec_guitarist;
CREATE PROCEDURE add_elec_guitarist (IN d VARCHAR(10), IN id INT)
BEGIN
	SELECT elec_guitarists FROM dates WHERE date = d INTO @j;
    SET @i = IF(JSON_SEARCH(@j, 'all', id) is not null, '[]', CONCAT('"', id, '"'));
    SELECT JSON_MERGE_PRESERVE(@j,@i) INTO @j;
    UPDATE dates SET elec_guitarists = @j WHERE date = d;
END //
DELIMITER ;
DELIMITER //
DROP PROCEDURE add_sound;
CREATE PROCEDURE add_sound (IN d VARCHAR(10), IN id INT)
BEGIN
	SELECT sounds FROM dates WHERE date = d INTO @j;
    SET @i = IF(JSON_SEARCH(@j, 'all', id) is not null, '[]', CONCAT('"', id, '"'));
    SELECT JSON_MERGE_PRESERVE(@j,@i) INTO @j;
    UPDATE dates SET sounds = @j WHERE date = d;
END //
DELIMITER ;
DELIMITER //
DROP PROCEDURE add_beamer;
CREATE PROCEDURE add_beamer (IN d VARCHAR(10), IN id INT)
BEGIN
	SELECT beamers FROM dates WHERE date = d INTO @j;
    SET @i = IF(JSON_SEARCH(@j, 'all', id) is not null, '[]', CONCAT('"', id, '"'));
    SELECT JSON_MERGE_PRESERVE(@j,@i) INTO @j;
    UPDATE dates SET beamers = @j WHERE date = d;
END //
DELIMITER ;
DELIMITER //
DROP PROCEDURE add_date;
CREATE PROCEDURE add_date (IN d VARCHAR(10))
BEGIN
	INSERT INTO dates VALUES (d, '[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]');
END //
DELIMITER ;