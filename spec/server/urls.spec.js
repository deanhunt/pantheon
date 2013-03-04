describe('urlsSpec', function(){
    var Urls;

    beforeEach(function(){
        Urls = require('../../urls.js');
    });

    describe('url weighing', function(){
        it('should default to a weight of 5', function(){
            var weight = Urls.weighUrl_('http://www.nytimes.com/something');

            expect(weight).toBe(5);
        });

        it('should provide additional weight for search results', function(){
            var weight = Urls.weighUrl_('https://www.google.com/search?q=Finished+scanning');

            expect(weight).toBe(8);
        });

        it('should provide additional weight for facebook profile pages', function(){
            var weight = Urls.weighUrl_('http://www.facebook.com/someone');

            expect(weight).toBe(8);
        });

        it('should not provide additional weight for non-profile facebook pages', function(){
            var weight = Urls.weighUrl_('https://www.facebook.com/about/privacy/');

            expect(weight).toBe(5);
        });

        // TODO(dean):
        xit('should provide additional weight for twitter profile pages', function(){
            var weight = Urls.weighUrl_('http://www.nytimes.com/something');

            expect(weight).toBe(8);
        });

        // TODO(dean):
        xit('should provide additional weight for tweets', function(){
            var weight = Urls.weighUrl_('http://www.nytimes.com/something');

            expect(weight).toBe(8);
        });

        it('should provide additional weight for query parameters', function(){
            var weight = Urls.weighUrl_('http://www.nytimes.com/something?quey=something');

            expect(weight).toBe(6);
        });

        it('should remove weight for urls with a path (without slash)', function(){
            var weight = Urls.weighUrl_('http://www.nytimes.com');

            expect(weight).toBe(3);
        });

        it('should remove weight for urls with a path (with slash)', function(){
            var weight = Urls.weighUrl_('http://www.nytimes.com/');

            expect(weight).toBe(3);
        });
    }); // describe('url weighing')

    describe('allowed urls', function(){
        it('should not allow https urls by default', function(){

        });

        it('should allow https Facebook profiles', function(){

        });

        it('should allow https Twitter profiles', function(){

        });

        it('should allow https tweets', function(){

        });

        it('should not allow duplicates', function(){

        });

        it('should not allow urls which differ only by query string', function(){

        });
    });
});
