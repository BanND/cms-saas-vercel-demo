import { createClient } from "@remkoj/optimizely-graph-client";
import { getSdk } from "@/gql/client";
import { gql, type GraphQLClient } from "graphql-request";
import type * as Types from "@gql/graphql";
import { Locales } from "@gql/graphql";
import FxProvider from "@/components/fx-test/fx-provider";

function getContentByPath(
  client: GraphQLClient,
  variables: Types.getContentByPathQueryVariables,
): Promise<Types.getContentByPathQuery> {
  console.log("getContentByPath called with variables:", variables);
  const query = gql`
    query getContentByPath(
      $path: [String!]!
      $locale: [Locales!]
      $siteId: String
    ) {
      content: _Content(
        where: {
          _metadata: { url: { default: { in: $path }, base: { eq: $siteId } } }
        }
        # variation: { include: SOME, value: "var1" }
        variation: { include: ALL }
        locale: $locale
      ) {
        total
        items {
          ...IContentData
          ...PageData
          ...BlankExperienceData
          ...BlogSectionExperienceData
          ...BlogPostPageData
          ...LandingPageData
        }
      }
    }
    fragment BlankExperienceData on BlankExperience {
      BlankExperienceSeoSettings {
        ...PageSeoSettingsPropertyData
      }
      ...ExperienceData
    }
    fragment BlogSectionExperienceData on BlogSectionExperience {
      ...ExperienceData
    }
    fragment BlogPostPageData on BlogPostPage {
      blogTitle: Heading
      blogSubtitle: ArticleSubHeading
      blogImage: BlogPostPromoImage {
        ...ReferenceData
      }
      blogBody: BlogPostBody {
        json
      }
      blogAuthor: ArticleAuthor
      blogTopics: Topic
      continueReading {
        ...IContentListItem
        ...BlockData
        ...ImageMediaComponentData
        ...VideoMediaComponentData
        ...ArticleListElementData
        ...ButtonBlockData
        ...CTAElementData
        ...CarouselBlockData
        ...ContentRecsElementData
        ...ContinueReadingComponentData
        ...HeadingElementData
        ...HeroBlockData
        ...ImageElementData
        ...LayoutSettingsBlockData
        ...MegaMenuGroupBlockData
        ...MenuNavigationBlockData
        ...OdpEmbedBlockData
        ...PageSeoSettingsData
        ...ParagraphElementData
        ...QuoteBlockData
        ...RichTextElementData
        ...TestimonialElementData
        ...TextBlockData
        ...VideoElementData
        ...BlankSectionData
      }
    }
    fragment LandingPageData on LandingPage {
      TopContentArea {
        ...BlockData
        ...ArticleListElementData
        ...ButtonBlockData
        ...CTAElementData
        ...CarouselBlockData
        ...ContentRecsElementData
        ...ContinueReadingComponentData
        ...HeadingElementData
        ...HeroBlockData
        ...ImageElementData
        ...LayoutSettingsBlockData
        ...MegaMenuGroupBlockData
        ...MenuNavigationBlockData
        ...OdpEmbedBlockData
        ...PageSeoSettingsData
        ...ParagraphElementData
        ...QuoteBlockData
        ...RichTextElementData
        ...TestimonialElementData
        ...TextBlockData
        ...VideoElementData
        ...BlankSectionData
      }
      MainContentArea {
        ...BlockData
        ...ArticleListElementData
        ...ButtonBlockData
        ...CTAElementData
        ...CarouselBlockData
        ...ContentRecsElementData
        ...ContinueReadingComponentData
        ...HeadingElementData
        ...HeroBlockData
        ...ImageElementData
        ...LayoutSettingsBlockData
        ...MegaMenuGroupBlockData
        ...MenuNavigationBlockData
        ...OdpEmbedBlockData
        ...PageSeoSettingsData
        ...ParagraphElementData
        ...QuoteBlockData
        ...RichTextElementData
        ...TestimonialElementData
        ...TextBlockData
        ...VideoElementData
        ...BlankSectionData
      }
    }
    fragment IContentData on _IContent {
      _metadata {
        ...IContentInfo
      }
      _type: __typename
    }
    fragment PageData on _IContent {
      ...IContentData
    }
    fragment PageSeoSettingsPropertyData on PageSeoSettingsProperty {
      MetaTitle
      MetaDescription
      MetaKeywords
      SharingImage {
        ...ReferenceData
      }
      GraphType
    }
    fragment ExperienceData on _IExperience {
      composition {
        ...CompositionNodeData
        nodes {
          ...CompositionNodeData
          ... on ICompositionStructureNode {
            nodes {
              ...CompositionNodeData
              ... on ICompositionStructureNode {
                nodes {
                  ...CompositionNodeData
                  ... on ICompositionStructureNode {
                    nodes {
                      ...CompositionNodeData
                      ...CompositionComponentNodeData
                    }
                  }
                }
              }
            }
          }
          ...CompositionComponentNodeData
        }
      }
    }
    fragment ReferenceData on ContentReference {
      key
      url {
        ...LinkData
      }
    }
    fragment LinkData on ContentUrl {
      base
      default
    }
    fragment CompositionNodeData on ICompositionNode {
      name: displayName
      layoutType: nodeType
      type
      key
      template: displayTemplateKey
      settings: displaySettings {
        key
        value
      }
    }
    fragment CompositionComponentNodeData on ICompositionComponentNode {
      component {
        ...BlockData
        ...ElementData
        ...ArticleListElementData
        ...ButtonBlockData
        ...CTAElementData
        ...CarouselBlockData
        ...ContentRecsElementData
        ...ContinueReadingComponentData
        ...HeadingElementData
        ...HeroBlockData
        ...ImageElementData
        ...LayoutSettingsBlockData
        ...MegaMenuGroupBlockData
        ...MenuNavigationBlockData
        ...OdpEmbedBlockData
        ...PageSeoSettingsData
        ...ParagraphElementData
        ...QuoteBlockData
        ...RichTextElementData
        ...TestimonialElementData
        ...TextBlockData
        ...VideoElementData
        ...BlankSectionData
      }
    }
    fragment ArticleListElementData on ArticleListElement {
      articleListCount
      topics
    }
    fragment ButtonBlockData on ButtonBlock {
      children: ButtonText
      url: ButtonUrl {
        ...LinkData
      }
      className: ButtonClass
      buttonType: ButtonType
      buttonVariant: ButtonVariant
    }
    fragment CTAElementData on CTAElement {
      cta_text: Text
      cta_link: Link {
        ...LinkData
      }
    }
    fragment CarouselBlockData on CarouselBlock {
      CarouselItemsContentArea {
        ...IContentListItem
        ...BlockData
        ...ImageMediaComponentData
        ...VideoMediaComponentData
        ...ArticleListElementData
        ...ButtonBlockData
        ...CTAElementData
        ...CarouselBlockData
        ...ContentRecsElementData
        ...ContinueReadingComponentData
        ...HeadingElementData
        ...HeroBlockData
        ...ImageElementData
        ...LayoutSettingsBlockData
        ...MegaMenuGroupBlockData
        ...MenuNavigationBlockData
        ...OdpEmbedBlockData
        ...PageSeoSettingsData
        ...ParagraphElementData
        ...QuoteBlockData
        ...RichTextElementData
        ...TestimonialElementData
        ...TextBlockData
        ...VideoElementData
        ...BlankSectionData
      }
    }
    fragment ContentRecsElementData on ContentRecsElement {
      ElementDeliveryApiKey
      ElementRecommendationCount
    }
    fragment ContinueReadingComponentData on ContinueReadingComponent {
      topline
      shared
      heading
      content {
        ...IContentData
        ...BlockData
        ...ArticleListElementData
        ...ButtonBlockData
        ...CTAElementData
        ...CarouselBlockData
        ...ContentRecsElementData
        ...ContinueReadingComponentData
        ...HeadingElementData
        ...HeroBlockData
        ...ImageElementData
        ...LayoutSettingsBlockData
        ...MegaMenuGroupBlockData
        ...MenuNavigationBlockData
        ...OdpEmbedBlockData
        ...PageSeoSettingsData
        ...ParagraphElementData
        ...QuoteBlockData
        ...RichTextElementData
        ...TestimonialElementData
        ...TextBlockData
        ...VideoElementData
        ...BlankSectionData
      }
    }
    fragment HeadingElementData on HeadingElement {
      headingText
    }
    fragment HeroBlockData on HeroBlock {
      heroImage: HeroImage {
        ...ReferenceData
      }
      eyebrow: Eyebrow
      heroHeading: Heading
      heroSubheading: SubHeading
      heroDescription: Description {
        json
        html
      }
      heroColor: HeroColor
      heroButton: HeroButton {
        ...ButtonBlockPropertyData
      }
    }
    fragment ImageElementData on ImageElement {
      altText
      imageLink {
        ...ReferenceData
      }
    }
    fragment LayoutSettingsBlockData on LayoutSettingsBlock {
      mainMenu {
        ...IContentListItem
        ...ImageMediaComponentData
        ...VideoMediaComponentData
      }
      contactInfoHeading
      serviceButtons {
        ...IContentListItem
        ...ImageMediaComponentData
        ...VideoMediaComponentData
      }
      contactInfo {
        json
        html
      }
      footerMenus {
        ...IContentListItem
        ...ImageMediaComponentData
        ...VideoMediaComponentData
      }
      copyright
      legalLinks {
        ...LinkItemData
      }
      appIdentifiers
    }
    fragment MegaMenuGroupBlockData on MegaMenuGroupBlock {
      _metadata {
        displayName
      }
      MenuMenuHeading
      MegaMenuUrl {
        ...LinkData
      }
      MegaMenuContentArea {
        ...IContentData
        ...MenuNavigationBlockData
        ...BlogPostPageMenuBlock
      }
    }
    fragment MenuNavigationBlockData on MenuNavigationBlock {
      _metadata {
        displayName
      }
      MenuNavigationHeading
      NavigationLinks {
        ...LinkItemData
      }
    }
    fragment OdpEmbedBlockData on OdpEmbedBlock {
      ContentId
    }
    fragment PageSeoSettingsData on PageSeoSettings {
      MetaTitle
      MetaDescription
      MetaKeywords
      SharingImage {
        ...ReferenceData
      }
      GraphType
    }
    fragment ParagraphElementData on ParagraphElement {
      text {
        json
      }
    }
    fragment QuoteBlockData on QuoteBlock {
      quote: QuoteText
      color: QuoteColor
      active: QuoteActive
      name: QuoteProfileName
      profilePicture: QuoteProfilePicture {
        ...ReferenceData
      }
      location: QuoteProfileLocation
    }
    fragment RichTextElementData on RichTextElement {
      text {
        json
        html
      }
    }
    fragment TestimonialElementData on TestimonialElement {
      customerName
      customerLocation
      customerImage {
        ...ReferenceData
      }
      referenceTitle
      referenceText {
        json
      }
    }
    fragment TextBlockData on TextBlock {
      overline: TextBlockOverline
      headingSize: TextBlockHeadingSize
      heading: TextBlockHeading
      description: TextBlockDescription {
        json
        html
      }
      center: TextCenter
      width: TextBlockWidth
      className: TextClassName
    }
    fragment VideoElementData on VideoElement {
      title
      video {
        ...ReferenceData
      }
      placeholder {
        ...ReferenceData
      }
    }
    fragment BlankSectionData on BlankSection {
      _metadata {
        key
      }
    }
    fragment ElementData on _IComponent {
      ...IElementData
    }
    fragment BlockData on _IComponent {
      ...IContentData
    }
    fragment ImageMediaComponentData on ImageMedia {
      alt: AltText
      meta: _metadata {
        url {
          default
        }
        name: displayName
      }
    }
    fragment VideoMediaComponentData on VideoMedia {
      meta: _metadata {
        url {
          default
        }
        name: displayName
      }
    }
    fragment IContentListItem on _IContent {
      ...IContentData
    }
    fragment ButtonBlockPropertyData on ButtonBlockProperty {
      children: ButtonText
      url: ButtonUrl {
        ...LinkData
      }
      className: ButtonClass
      buttonType: ButtonType
      buttonVariant: ButtonVariant
    }
    fragment LinkItemData on Link {
      title
      text
      target
      url {
        ...LinkData
      }
    }
    fragment BlogPostPageMenuBlock on BlogPostPage {
      meta: _metadata {
        published
        url {
          ...LinkData
        }
      }
      topics: Topic
      heading: Heading
      author: ArticleAuthor
      image: BlogPostPromoImage {
        ...ReferenceData
      }
      sharing: SeoSettings {
        description: MetaDescription
        image: SharingImage {
          ...ReferenceData
        }
      }
    }
    fragment IElementData on _IComponent {
      _metadata {
        ...IContentInfo
      }
      _type: __typename
    }
    fragment IContentInfo on IContentMetadata {
      key
      locale
      types
      displayName
      variation
      version
      url {
        ...LinkData
      }
    }
  `;
  var result = client.request<
    Types.getContentByPathQuery,
    Types.getContentByPathQueryVariables
  >(query, variables);
  console.log("getContentByPath result:", result);
  return result;
}

const Page = async () => {
  const graphClient = createClient(undefined, undefined, {
    nextJsFetchDirectives: true,
    cache: true,
    queryCache: true,
  });
  const sdk = getSdk(graphClient);
  const result = await getContentByPath(graphClient, {
    path: "/en/fx-test/",
    locale: Locales.en,
  });
  const contents = (result.content?.items as Array<any>) ?? [];
  console.log(
    ">>> Optimizely Client Initialized:",
    JSON.stringify(contents, null, 2),
  );

  return (
    <div>
      <h1>Optimizely Feature Experimentation Test Page</h1>
      {/* <p>These are all {contents.length} variations of this content which being fetched from server side:</p>
      <ul>
        {contents.map((content) => (
          <li key={content._metadata.key}>
            <p>---------------------------------</p>
            <p>
              Name: {content._metadata.displayName} <br />
              Variation: {content._metadata.variation || "Original"} <br />
            </p>
            <p>
              SEO Settings:{" "}
              {content.BlankExperienceSeoSettings?.MetaTitle || "No Title"} <br />
            </p>
            <p>
              Heading Text:{" "}
              {content.composition.nodes[0]?.nodes[0]?.nodes[0]?.nodes[0]?.component?.headingText} <br />
            </p>
            <p>---------------------------------</p>
          </li>
        ))}
      </ul> */}
      <FxProvider contents={contents} />
    </div>
  );
};

export default Page;
