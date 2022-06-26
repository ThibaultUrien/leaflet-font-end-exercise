# TODO

## Test

### Model

For now only a couple of classes in the model have unit test and not event the one that would cover the most error prone parts. As model is the part that implement the to handle the concern specific to the concern of this application, finishing implementing them should be the first thing to do. Also they should be quite simple to write.

### View

Test in view would require to use react-test-renderer. In many real project, one may have also in the CI some UI test suite based on tool like Selenium. As long as we managed to keep pushing logic in the model, most of the view behavior can be already covered by those test. In practice, it may be still convenient to write a couple of them in case some behaviors still sneak in the view, for corner cases or just to detect the error early as ui test can take a lot of time.

### Infra

Infra logic should remain as simple as possible. Here the infra part only contain a connection to web storage. In the case it would contains some api connection, adding pact test or unit test with mocked server could be nice. But ideally infra should just contains facades on top of other library.

## Doc

The code documentation is a bit laky. At least all methods in the model should have some doc so that devs using the, from view and infra can be easily informed of edges case or surprising behaviors.
