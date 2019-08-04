DELIMITER //
DROP PROCEDURE remove_singer;
CREATE PROCEDURE remove_singer (IN d VARCHAR(10), IN id INT)
BEGIN
    UPDATE dates
    SET singers = JSON_REMOVE(
		singers, replace(json_search(singers, 'one', id), '"', '')
    )
    WHERE date = d AND json_search(singers, 'one', id) IS NOT NULL;
END //
DELIMITER ;
DELIMITER //
DROP PROCEDURE remove_sing_leader;
CREATE PROCEDURE remove_sing_leader (IN d VARCHAR(10), IN id INT)
BEGIN
    UPDATE dates
    SET sing_leaders = JSON_REMOVE(
		sing_leaders, replace(json_search(sing_leaders, 'one', id), '"', '')
    )
    WHERE date = d AND json_search(sing_leaders, 'one', id) IS NOT NULL;
END //
DELIMITER ;
DELIMITER //
DROP PROCEDURE remove_guitarist;
CREATE PROCEDURE remove_guitarist (IN d VARCHAR(10), IN id INT)
BEGIN
    UPDATE dates
    SET guitarists = JSON_REMOVE(
		guitarists, replace(json_search(guitarists, 'one', id), '"', '')
    )
    WHERE date = d AND json_search(guitarists, 'one', id) IS NOT NULL;
END //
DELIMITER ;
DELIMITER //
DROP PROCEDURE remove_bass_guitarist;
CREATE PROCEDURE remove_bass_guitarist (IN d VARCHAR(10), IN id INT)
BEGIN
    UPDATE dates
    SET bass_guitarists = JSON_REMOVE(
		bass_guitarists, replace(json_search(bass_guitarists, 'one', id), '"', '')
    )
    WHERE date = d AND json_search(bass_guitarists, 'one', id) IS NOT NULL;
END //
DELIMITER ;
DELIMITER //
DROP PROCEDURE remove_pianist;
CREATE PROCEDURE remove_pianist (IN d VARCHAR(10), IN id INT)
BEGIN
    UPDATE dates
    SET pianists = JSON_REMOVE(
		pianists, replace(json_search(pianists, 'one', id), '"', '')
    )
    WHERE date = d AND json_search(pianists, 'one', id) IS NOT NULL;
END //
DELIMITER ;
DELIMITER //
DROP PROCEDURE remove_drummer;
CREATE PROCEDURE remove_drummer (IN d VARCHAR(10), IN id INT)
BEGIN
    UPDATE dates
    SET drummers = JSON_REMOVE(
		drummers, replace(json_search(drummers, 'one', id), '"', '')
    )
    WHERE date = d AND json_search(drummers, 'one', id) IS NOT NULL;
END //
DELIMITER ;
DELIMITER //
DROP PROCEDURE remove_elec_guitarist;
CREATE PROCEDURE remove_elec_guitarist (IN d VARCHAR(10), IN id INT)
BEGIN
    UPDATE dates
    SET elec_guitarists = JSON_REMOVE(
		elec_guitarists, replace(json_search(elec_guitarists, 'one', id), '"', '')
    )
    WHERE date = d AND json_search(elec_guitarists, 'one', id) IS NOT NULL;
END //
DELIMITER ;
DELIMITER //
DROP PROCEDURE remove_sound;
CREATE PROCEDURE remove_sound (IN d VARCHAR(10), IN id INT)
BEGIN
    UPDATE dates
    SET sounds = JSON_REMOVE(
		sounds, replace(json_search(sounds, 'one', id), '"', '')
    )
    WHERE date = d AND json_search(sounds, 'one', id) IS NOT NULL;
END //
DELIMITER ;
DELIMITER //
DROP PROCEDURE remove_beamer;
CREATE PROCEDURE remove_beamer (IN d VARCHAR(10), IN id INT)
BEGIN
    UPDATE dates
    SET beamers = JSON_REMOVE(
		beamers, replace(json_search(beamers, 'one', id), '"', '')
    )
    WHERE date = d AND json_search(beamers, 'one', id) IS NOT NULL;
END //
DELIMITER ;