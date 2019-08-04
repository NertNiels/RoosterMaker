
SET @date = '14_07_2019';
SELECT Singers FROM roostermaker_ege.dates WHERE date = @date INTO @j;

SET @i = 4;
SET @i = IF(JSON_SEARCH(@j, 'all', @i) is not null, '[]', CONCAT('"', @i, '"'));
SELECT JSON_MERGE_PRESERVE(@j, @i) INTO @j;

UPDATE roostermaker_ege.dates SET Singers = @j WHERE date = @date;